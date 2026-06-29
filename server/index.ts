import app from './src/app'

const port = process.env.PORT || "3001";
const server = app.listen(port);
server.on('listening', () =>
  console.log(`Server running on http://localhost:${port}`)
)
