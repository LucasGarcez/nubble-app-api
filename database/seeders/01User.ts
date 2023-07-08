import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Maria',
        lastName: 'Julia',
        username: 'mariajulia',
        profileURL: 'https://imgur.com/72QJ7vu.jpg',
        email: 'mariajulia@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Tamires',
        lastName: 'Silva',
        username: 'tami_silva',
        profileURL: 'https://imgur.com/iAMU5ao.jpg',
        email: 'tsilva@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Ana',
        lastName: 'Oliveira',
        username: 'aninha23',
        profileURL: 'https://i.imgur.com/XpWT9dI.jpg',
        email: 'oliveiraana23@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Marcelo',
        lastName: 'Tavares',
        username: 'celotavares',
        profileURL: 'https://imgur.com/QRLeJbU.jpg',
        email: 'celotavares@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Vanessa',
        lastName: 'Isidório',
        username: 'vanessa_isidorio',
        profileURL: 'https://imgur.com/VpHqBt7.jpg',
        email: 'vanessa123@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Samuel',
        lastName: 'Vilar',
        username: 'samuelvilar',
        profileURL: 'https://imgur.com/dllY9rT.jpg',
        email: 'samu.vilar@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Mateus',
        lastName: 'de Souza',
        username: 'mateussouza',
        profileURL: 'https://imgur.com/wgY2jK1.jpg',
        email: 'msouza@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Gabriel',
        lastName: 'Lemos',
        username: 'glemos',
        profileURL: 'https://imgur.com/umN92BV.jpg',
        email: 'glemos@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Carla',
        lastName: 'Santos',
        username: 'carlasantos',
        profileURL: 'https://imgur.com/m27PD3q.jpg',
        email: 'carlasantos@coffstack.com',
        password: 'supersecret',
      },
    ])
  }
}
