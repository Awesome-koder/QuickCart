import { Inngest } from "inngest";
import ConnectDb from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "arenit-next " });

// Inngest Function to save user data to a database 
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },

    { event : 'clerk/user.created' },
    async ({event}) => {
        const { id,first_name,last_name,email_addresses, image_url } = event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await ConnectDb()
        await User.create(userData)
    }
)

// Inngest Function to update user data in database 
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updateed' },
    async ({event}) => {
        const { id,first_name,last_name,email_addresses, image_url } = event.data
        const userData = {
            _id:id,
            email:email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await ConnectDb()
        await User.findByIdAndUpdate(id,userData)
    }
)

// Inngest Function to delete user function from database

export const syncUserDeletion = inngest.createFunction(
    {
        id : 'delete-user-with-clerk'
    },
    { event: 'clerk-user-deleted'},
    async ({event}) => {
        const {id} = event.data

        await ConnectDb()
        await userAgent.findByIdAndDelete(id)
    }
)