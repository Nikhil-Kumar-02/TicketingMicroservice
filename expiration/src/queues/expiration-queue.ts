import Queue from "bull";
import { ExpirationCompletePublsiher } from "../events/publisher/expiration-complete-publisher";
import { KafkaManager } from "../kafkaManager";

interface Payload{
  orderId : string;
}

const expirationQueue = new Queue<Payload>("order:expiration" , {
  redis : {
    host : process.env.REDIS_HOST
  }
})

expirationQueue.process(async (job) => {

  console.log("publishing the event for expiration completed : ");

  await new ExpirationCompletePublsiher(KafkaManager.getProducer()).publishMessage({
    orderId : job.data.orderId
  })
  
})

export {expirationQueue};