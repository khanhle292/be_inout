import Items from "./Items";
import Vehicles from "./Vehicles";
import VehicleTypes from "./VehicleTypes";
import Merchants from "./Merchants";
import Transactions from "./Transactions";
import VehiclePrices from "./VehiclePrices";
import Images from "./Images";

class ModelWorker {
  async sync() {
    await new Merchants().migrate();
    await new VehicleTypes().migrate();
    await new Vehicles().migrate();
    await new Images().migrate();
    await new VehiclePrices().migrate();
    await new Items().migrate();
    await new Transactions().migrate();
  }
}

export default ModelWorker;
