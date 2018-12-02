pragma solidity ^0.4.24;

contract Election {
    // Define Candidate
    struct Candidate {
        uint id;
        string name;
        uint votes;
    }
    // Candidates storage
    mapping(uint => Candidate) public candidates;
    // Accounts that have voted
    mapping(address => bool) public voters;
    // Store number of candidates
    // No need to initialize because default is 0
    uint public candidateCount;

    // Constructor
    constructor() public {
        // Add the candidates
        addCandidate("Donald Trump");
        addCandidate("Hillary Clinton");
    }

    // Add a Candidate
    function addCandidate(string _name) private {
        // Increment candidateCount
        candidateCount++;
        // Create and add Candidate
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function castVote(uint _id) public {
        // Check if account already voted
        require(!voters[msg.sender]);
        // Check if _id is valid
        require(_id > 0 && _id <= candidateCount);
        // Record the account that votes
        voters[msg.sender] = true;
        // Increment the vote for the Candidate with _id
        candidates[_id].votes++;
    }
}
