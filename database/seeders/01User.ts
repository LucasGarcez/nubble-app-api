import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Maria',
        lastName: 'Julia',
        username: 'mariajulia',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/1-maria.png',
        email: 'mariajulia@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Tamires',
        lastName: 'Silva',
        username: 'tami_silva',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/4-tamires.png',
        email: 'tsilva@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Ana',
        lastName: 'Oliveira',
        username: 'aninha23',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/7-ana.png',
        email: 'oliveiraana23@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Marcelo',
        lastName: 'Tavares',
        username: 'celotavares',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/6-marcelo.png',
        email: 'celotavares@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Vanessa',
        lastName: 'Isidório',
        username: 'vanessa_isidorio',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/9-vanessa.png',
        email: 'vanessa123@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Samuel',
        lastName: 'Vilar',
        username: 'samuelvilar',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/5-samuel.png',
        email: 'samu.vilar@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Mateus',
        lastName: 'de Souza',
        username: 'mateussouza',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/8-mateus.png',
        email: 'msouza@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Gabriel',
        lastName: 'Lemos',
        username: 'glemos',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/3-gabriel.png',
        email: 'glemos@coffstack.com',
        password: 'supersecret',
      },
      {
        firstName: 'Carla',
        lastName: 'Santos',
        username: 'carlasantos',
        profileURL: 'https://nubble-development.s3.sa-east-1.amazonaws.com/backend-integration/2-carla.png',
        email: 'carlasantos@coffstack.com',
        password: 'supersecret',
      },
    ])
  }
}
