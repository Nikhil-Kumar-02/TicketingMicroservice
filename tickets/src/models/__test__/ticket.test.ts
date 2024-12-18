import { Ticket } from "../ticket";

it("implements optimistice concurrency control " , async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123"
  })

  //save the ticket to the database
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two seperate changes to the ticket we fetched
  firstInstance!.set({price : 200});
  secondInstance!.set({price : 100});

  //save the first fetched ticket
  await firstInstance!.save();

  //save the second fetched ticket and expect an error
  try{
    await secondInstance!.save();
  }
  catch(err){
    return;
  }

  throw new Error("should not reach to this point");
})

it("increaments the version number on multiple saves" , async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123"
  })

  //save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0);
  
  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);

})
