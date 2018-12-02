let Election = artifacts.require("./Election.sol")

contract("Election", (accounts) => {
    let electionInstance;

    it("Initializes with two candidates", () => {
        return Election.deployed().then((instance) => {
            return instance.candidateCount();
        }).then((count) => {
            assert.equal(count, 2, "Has incorrect number of candidates");
        });
    });

    it("Initializes candidates with correct values", () => {
        return Election.deployed().then((i) => {
            electionInstance = i;
            return electionInstance.candidates(1);
        }).then((candidate) => {
            assert.equal(candidate[0], 1, "Candidate 1 has incorrect id");
            assert.equal(candidate[1], "Donald Trump", "Candidate 1 has incorrect name");
            assert.equal(candidate[2], 0, "Candidate 1 has incorrect vote count");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            assert.equal(candidate[0], 2, "Candidate 2 has incorrect id");
            assert.equal(candidate[1], "Hillary Clinton", "Candidate 2 has incorrect name");
            assert.equal(candidate[2], 0, "Candidate 2 has incorrect vote count");
        });
    });

    it("Allows an account to vote", () => {
        return Election.deployed().then((i) => {
            electionInstance = i;
            candidateId = 2;
            return electionInstance.castVote(candidateId, {from: accounts[1]});
        }).then((rec) => {
            return electionInstance.voters(accounts[1]);
        }).then((vote) => {
            assert(vote, "The voter is marked as voted");
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            assert.equal(candidate[2], 1, "The candidate unsuccessfully received his vote");
        });
    });

    it("Does not allow account to vote twice", () => {
        return Election.deployed().then((i) => {
            electionInstance = i;
            candidateId = 1;
            return electionInstance.castVote(candidateId, {from: accounts[2]});
        }).then((rec) => {
            return electionInstance.voters(accounts[1]);
        }).then((vote) => {
            assert(vote, "The voter is not marked as voted");
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            assert.equal(candidate[2], 1, "The candidate unsuccessfully received his vote");
            return electionInstance.castVote(candidateId, {from: accounts[2]});
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            assert.equal(candidate[2], 1, "The candidate received a second vote from same account");            
        });
    });

    it("Does not allow an unexisting candidate id", () => {
        return Election.deployed().then((i) => {
            electionInstance = i;
            candidateId = 100;
            return electionInstance.castVote(candidateId, {from: accounts[3]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            return electionInstance.candidates(1);
        }).then((candidate) => {
            assert.equal(candidate[2], 1, "Candidate 1 received vote");
            return electionInstance.candidates(2);
        }).then((candidate) => {
            assert.equal(candidate[2], 1, "Candidate 2 received vote");
        });
    });
});
