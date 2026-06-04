require('dotenv').config()

const mongoose =
  require('mongoose')

const app =
  require('./app')

const PORT =
  process.env.PORT || 3000

const mongoUrl =
  process.env.DATABASE_URL

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log(
      'Database connected'
    )

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        )
      }
    )
  })
  .catch((err) => {
    console.error(
      'Database connection error',
      err
    )
  })