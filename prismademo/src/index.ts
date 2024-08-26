import { PrismaClient } from "@prisma/client";
import { log } from "console";

const prisma = new PrismaClient();

async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
) {
  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });
  console.log(createdUser);
}

// createUser(
//     "john.doe@example.com",
//     "John",
//     "Doe",
//     "securePassword123!"
//   );

async function Updateuser(password: string) {
  await prisma.user.update({
    data: {
      password,
    },
    where: {
      id: 1,
    },
  });
}

// Updateuser("sajiloPassword");


async function findUser (id:number) {
    const foundUser = await prisma.user.findFirst({
        where:{
            id
        }
    })
    console.log(foundUser);
    
}

// findUser(3);

// deleting user 

async function Deleteuser (id:number){
    const deletedUser = await prisma.user.delete({
        where:{
            id
        }
    })
    console.log(deletedUser);
    
}
//  Deleteuser(1);
