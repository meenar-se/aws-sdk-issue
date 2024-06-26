import Fastify from 'fastify'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
const fastify = Fastify({
  logger: true
})
fastify.get('/ping', async function handler (request, reply) {
    fastify.log.info("ping method started")
    const client = new SSMClient({})
      try {
        const command = new GetParameterCommand({Name: '/test/my-ssm', WithDecryption:true});
        const response = await client.send(command);
        fastify.log.info(`SSM Output:, ${response}`);
        return { message: JSON.stringify(response) }
        
      } catch (error) {
          fastify.log.error(error, "Error getting SSM Parameter:");
          return {message: JSON.stringify(error)}
      }
    
  })
fastify.get('/health', async function handler (request, reply) {
    return { message: 'healthy!!' }
  })

// Run the server!
try {
  fastify.listen({ port: 8080 }).then((msg) => {
    fastify.log.info("server started")
  })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
