import pkg from 'bloom-filters';
const { BloomFilter } = pkg;
import {Account} from "../models/account.model.js";

//create a bloom filter that can hold 100,000 emails with a 1% false positive rate
export const emailBloomFilter = BloomFilter.create(100000, 0.01);

export const initializeBloomFilter = async() => {
    try{
        console.log("Intializing Bloom filter ....");
        const accounts = await Account.find({},{
            email:1,
            _id:0
        });
        accounts.forEach(acc => {
            if(acc.email){
                emailBloomFilter.add(acc.email);
            }
        });
        console.log(`Bloom Filter Fully Loaded with ${accounts.length} emails`);
    }
    catch(error){
        console.error("Failed to intialize  Bloom Filter : " , error);
    }
}