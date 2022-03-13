// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

error InvalidMint();
error NoMaxSupply();

contract LegacyOfPolMedinaJr is 
  Ownable,
  ReentrancyGuard,
  ERC1155Burnable,
  ERC1155Pausable,
  ERC1155Supply
{
  // ============ Constants ============

  //royalty percent
  uint256 public constant ROYALTY_PERCENT = 1000;
  //royalty recipient
  PaymentSplitter public immutable ROYALTY_RECIPIENT;
  //bytes4(keccak256("royaltyInfo(uint256,uint256)")) == 0x2a55205a
  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

  // ============ Structs ============

  struct Token {
    uint256 maxSupply;
    uint256 mintPrice;
    bool active;
  }

  // ============ Storage ============

  //mapping of token id to token info (max, price)
  mapping(uint256 => Token) private _tokens;
  //the contract metadata
  string private _contractURI;

  // ============ Deploy ============

  /**
   * @dev Sets the base token uri
   */
  constructor(
    string memory contract_uri,
    string memory token_uri, 
    address[] memory payees, 
    uint256[] memory shares
  ) ERC1155(token_uri) {
    ROYALTY_RECIPIENT = new PaymentSplitter(payees, shares);
    _contractURI = contract_uri;
  }

  // ============ Read Methods ============

  /**
   * @dev Returns the contract URI
   */
  function contractURI() external view returns(string memory) {
    return _contractURI;
  }

  /**
   * @dev Returns true if the token exists
   */
  function exists(uint256 id) public view override returns(bool) {
    return _tokens[id].active;
  }

  /**
   * @dev Get the maximum supply for a token
   */
  function maxSupply(uint256 id) public view returns(uint256) {
    return _tokens[id].maxSupply;
  }

  /**
   * @dev Get the mint supply for a token
   */
  function mintPrice(uint256 id) public view returns(uint256) {
    return _tokens[id].mintPrice;
  }

  /**
   * @dev Returns the name
   */
  function name() external pure returns(string memory) {
    return "The Legacy of Pol Medina Jr.";
  }

  /**
   * @dev Get the remaining supply for a token
   */
  function remainingSupply(uint256 id) public view returns(uint256) {
    uint256 max = maxSupply(id);
    if (max == 0) revert NoMaxSupply();
    return max - totalSupply(id);
  }

  /**
   * @dev implements ERC2981 `royaltyInfo()`
   */
  function royaltyInfo(uint256, uint256 salePrice) 
    external 
    view 
    returns(address receiver, uint256 royaltyAmount) 
  {
    return (
      payable(address(ROYALTY_RECIPIENT)), 
      (salePrice * ROYALTY_PERCENT) / 10000
    );
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override
    returns(bool)
  {
    //support ERC2981
    if (interfaceId == _INTERFACE_ID_ERC2981) {
      return true;
    }
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Returns the symbol
   */
  function symbol() external pure returns(string memory) {
    return "PMJR";
  }

  /**
   * @dev Returns the max and price for a token
   */
  function tokenInfo(uint256 id) 
    external view returns(uint256 max, uint256 price, uint256 remaining)
  {
    return (
      _tokens[id].maxSupply, 
      _tokens[id].mintPrice, 
      remainingSupply(id)
    );
  }

  // ============ Write Methods ============

  /**
   * @dev Allows anyone to mint by purchasing
   */
  function buy(address to, uint256 id, uint256 quantity) 
    external payable nonReentrant 
  {
    //get price
    uint256 price = mintPrice(id) * quantity;
    //if there is a price and the amount sent is less than
    if(price == 0 || msg.value < price) revert InvalidMint();
    //we are okay to mint
    _mintSupply(to, id, quantity);
  }

  // ============ Admin Methods ============

  /**
   * @dev Adds a token that can be minted
   */
  function addToken(uint256 id, uint256 max, uint256 price) public onlyOwner {
    _tokens[id] = Token(max, price, true);
  }

  /**
   * @dev Allows admin to mint
   */
  function mint(address to, uint256 id, uint256 quantity) public onlyOwner {
    _mintSupply(to, id, quantity);
  }

  /**
   * @dev Allows admin to update URI
   */
  function updateURI(string memory newuri) public onlyOwner {
    _setURI(newuri);
  }

  /**
   * @dev Sends the entire contract balance to a `recipient`
   */
  function withdraw(address recipient) 
    external virtual nonReentrant onlyOwner
  {
    Address.sendValue(payable(recipient), address(this).balance);
  }

  /**
   * @dev This contract should not hold any tokens in the first place. 
   * This method exists to transfer out tokens funds.
   */
  function withdraw(IERC20 erc20, address recipient, uint256 amount) 
    external virtual nonReentrant onlyOwner
  {
    SafeERC20.safeTransfer(erc20, recipient, amount);
  }

  // ============ Internal Methods ============

  /**
   * @dev Mint token considering max supply
   */
  function _mintSupply(address to, uint256 id, uint256 quantity) internal {
    //if the id does not exists
    if (!exists(id)) revert InvalidMint();
    //get max and calculated supply
    uint256 max = maxSupply(id);
    uint256 supply = totalSupply(id) + quantity;
    //if there is a max supply and it was exceeded
    if(max > 0 && supply > max) revert InvalidMint();
    //we are okay to mint
    _mint(to, id, quantity, "");
  }

  // ============ Overrides ============

  /**
   * @dev Describes linear override for `_beforeTokenTransfer` used in 
   * both `ERC721` and `ERC721Pausable`
   */
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override(ERC1155, ERC1155Pausable, ERC1155Supply) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}