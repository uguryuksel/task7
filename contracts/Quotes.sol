pragma solidity >=0.8.0;

contract Quotes {
    
    uint public numberOfQuotes;
    mapping (uint => Quote) public quotes;

    struct Quote{
        uint quoteId;
        address owner;
        string author;
        string content;
    }

    function createQuote(string memory _author,string memory _content) external {
        numberOfQuotes+=1;
        quotes[numberOfQuotes] = Quote(numberOfQuotes,msg.sender,_author,_content);
    }

    function getAllQuotes() public view returns(Quote[] memory){
        
        Quote[] memory _quotes = new Quote[](numberOfQuotes);
        uint index=0;
        for(uint i=1;i<=numberOfQuotes;i++){
            _quotes[index] = quotes[i];
            index += 1;
        }
        
        return _quotes;

    }
    
}