import { getCustomRepository} from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import transactionsRouter from '../routes/transactions.routes';


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    // the id exists?
    const transaction = await transactionRepository.findOne(id);

    if(!transaction) {
      throw new AppError('Transaction does not exist');
    }
    //delete record
    await transactionRepository.remove(transaction);
    
  }
}

export default DeleteTransactionService;
