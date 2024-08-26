"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createUser(email, firstName, lastName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdUser = yield prisma.user.create({
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
    });
}
// createUser(
//     "john.doe@example.com",
//     "John",
//     "Doe",
//     "securePassword123!"
//   );
function Updateuser(password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.user.update({
            data: {
                password,
            },
            where: {
                id: 1,
            },
        });
    });
}
// Updateuser("sajiloPassword");
function findUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUser = yield prisma.user.findFirst({
            where: {
                id
            }
        });
        console.log(foundUser);
    });
}
// findUser(3);
// deleting user 
function Deleteuser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedUser = yield prisma.user.delete({
            where: {
                id
            }
        });
        console.log(deletedUser);
    });
}
Deleteuser(1);
