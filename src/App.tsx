import React from 'react';
import {Chat, Message, uuid} from 'react-demos'
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { DataStore } from '@aws-amplify/datastore'
import { User, Message as MessageModel} from './models'
Amplify.configure(awsconfig);


function App() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [usersOnline, setUsersOnline] = React.useState<User[]>([])
  const [messages, setMessages] = React.useState<Message[]>([])

  React.useEffect(() => {
    fetchMessage()
    const subscription = DataStore.observe(MessageModel).subscribe(fetchMessage)
    return () => subscription.unsubscribe()
  }, [])
  async function fetchMessage() {
    const _Messages = await DataStore.query(MessageModel)
    // // reminder: setState with the results of Message
    setMessages(_Messages.map(message => ({user: {id: message.id,name: message.user, isOnline: true}, text: message.text})))
  }



    React.useEffect(() => {
      fetchUser()
      const subscription = DataStore.observe(User).subscribe(fetchUser)
      return () => subscription.unsubscribe()
    }, [])
    async function fetchUser() {
      const _Users = await DataStore.query(User)
      // // reminder: setState with the results of User
      setUsersOnline(_Users)
    }



  // /** set currentUser and add them to usersOnline */
  async function onUserLoggedIn(name: string) {
    const _currentUser =  await DataStore.save(new User({name, isOnline: true}))
    setCurrentUser(_currentUser)

  }
  // /** (optional) unset currentUser and remove from usersOnline */
  async function onUserLoggedOut(id: string) {
    console.log(id)
  }
  // /** add to messages by also adding the currentUser */
  async function sendMessage(text: string) {
    if (currentUser) {
      await DataStore.save(new MessageModel({user: currentUser.name, text}))
    }
      // async function createMessage(newMessage: MessageType) {
      //   // reminder: check that newdata is valid
      //   // reminder: clear old state
      // }
  }
  return <Chat {...{currentUser, usersOnline, onUserLoggedIn, sendMessage, messages, onUserLoggedOut}} ></Chat>
}
export default App;
