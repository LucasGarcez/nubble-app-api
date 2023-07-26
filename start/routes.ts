import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

import 'App/Routes/UserRoutes'
import 'App/Routes/PostRoutes'
import 'App/Routes/MessageRoutes'