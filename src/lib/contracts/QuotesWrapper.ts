import Web3 from 'web3';
import * as QuotesJSON from '../../../build/contracts/Quotes.json';

import { Quotes } from '../../types/Quotes';
import { QUOTES_CONTRACT_ADDRESS } from '../../ui/helpers';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class QuotesWrapper {
    web3: Web3;

    contract: Quotes;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.address = QUOTES_CONTRACT_ADDRESS;
        this.contract = new web3.eth.Contract(QuotesJSON.abi as any) as any;
        this.contract.options.address = QUOTES_CONTRACT_ADDRESS;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotal(fromAddress: string) {
        const quote = await this.contract.methods.numberOfQuotes().call({ from: fromAddress });

        return quote;
    }

    async getAllQuotes(fromAddress: string) {
        const quotes = await this.contract.methods.getAllQuotes().call({ from: fromAddress });

        return quotes;
    }

    async getQuote(id: number, fromAddress: string) {
        const quote = await this.contract.methods.quotes(id).call({ from: fromAddress });

        return quote;
    }

    async createQuote(author: string, content: string, fromAddress: string) {
        const tx = await this.contract.methods.createQuote(author, content).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async deploy(fromAddress: string) {
        const tx = this.contract
            .deploy({
                data: QuotesJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress
            });

        let transactionHash: string = null;
        tx.on('transactionHash', (hash: string) => {
            transactionHash = hash;
        });

        const contract = await tx;

        this.useDeployed(contract.options.address);

        return transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
