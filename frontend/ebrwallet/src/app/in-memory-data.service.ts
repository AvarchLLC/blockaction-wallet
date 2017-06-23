import { InMemoryDbService} from 'angular-in-memory-web-api'

export class InMemoryDataService implements InMemoryDbService {
  createDb(){
    const walletFile = {
      
    }

    return {walletFile};    
  }
}