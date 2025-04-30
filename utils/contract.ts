import { ethers } from 'ethers';

const contractABI = [
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_fixedCandidates',
                type: 'address[]',
            },
            {
                internalType: 'string[]',
                name: '_fixedCandidateNames',
                type: 'string[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'candidate',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'isFixed',
                type: 'bool',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        name: 'CandidateAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'candidate',
                type: 'address',
            },
        ],
        name: 'CandidateRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'voter',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'candidate',
                type: 'address',
            },
        ],
        name: 'VoteCast',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'candidateAddresses',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'candidates',
        outputs: [
            {
                internalType: 'bool',
                name: 'exists',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'voteCount',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isFixed',
                type: 'bool',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_newCandidate',
                type: 'address',
            },
        ],
        name: 'changeVote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAllCandidates',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getCandidateCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getCurrentLeaders',
        outputs: [
            {
                internalType: 'address[]',
                name: 'leadingCandidates',
                type: 'address[]',
            },
            {
                internalType: 'uint256',
                name: 'highestVoteCount',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_candidate',
                type: 'address',
            },
        ],
        name: 'getVoteCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getVoteResults',
        outputs: [
            {
                internalType: 'address[]',
                name: 'candidateList',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: 'voteCounts',
                type: 'uint256[]',
            },
            {
                internalType: 'bool[]',
                name: 'fixedStatus',
                type: 'bool[]',
            },
            {
                internalType: 'string[]',
                name: 'candidateNames',
                type: 'string[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'hasVoted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_candidate',
                type: 'address',
            },
        ],
        name: 'isFixedCandidate',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        name: 'presentAsCandidate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'removeCandidate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalVotes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_candidate',
                type: 'address',
            },
        ],
        name: 'vote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const getProvider = () => {
    return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.api.moonbase.moonbeam.network');
};

export const getContract = () => {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
};

export const getContractWithSigner = (privateKey: string) => {
    const provider = getProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
};

export const formatCandidates = (candidateList: string[], voteCounts: bigint[], fixedStatus: boolean[], candidateNames: string[]) => {
    return candidateList.map((address, index) => ({
        address,
        name: candidateNames[index] || 'Unknown',
        voteCount: Number(voteCounts[index]),
        isFixed: fixedStatus[index],
    }));
};
