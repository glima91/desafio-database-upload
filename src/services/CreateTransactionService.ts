import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income'|'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    // check if there are money to spend
    const { total } = await transactionsRepository.getBalance();
    
    if(type === 'outcome' && total < value) {
      throw new AppError("You do not have enough balance.");
    }

    // check if category exists
    let transactionCategory = await categoriesRepository.findOne({ 
      where: { category }
    });

    // create category if not exists
    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
       title: category, 
      });
      await categoriesRepository.save(transactionCategory);

    }


    // create transaction
    const transaction = await transactionsRepository.create({ 
      title, 
      value, 
      type, 
      category: transactionCategory,
       });

    await transactionsRepository.save(transaction);
    
    return transaction;
  };
  
}

export default CreateTransactionService;
