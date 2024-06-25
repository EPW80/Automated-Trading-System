var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Define a class that implements the IDataAccess interface
export class JSONDataAdapter {
    // Constructor that takes an instance of the JSONDataAccess class
    constructor(adaptee) {
        this.adaptee = adaptee;
    }
    // Async request method that calls the getMarketData method of the adaptee
    request(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adaptee.getMarketData(symbol);
        });
    }
}
