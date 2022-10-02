const express        = require( 'express' ),
      app            = express(),
      LoginRoutes    = require( './login' ),
      RegisterRoutes = require( './register' ),
      Users          = require( './users' ),
      Suburb         = require( './suburb' ),
      Auth           = require( './auth' ),
      EmployeeRols   = require( './employeeRols' );
      swaggerJsdoc   = require( "swagger-jsdoc" ),
      { options }    = require( '../Lib/swaggerDoc' ),
      swaggerUi      = require( "swagger-ui-express" );

app.use( '/register', RegisterRoutes )

app.use( '/login', LoginRoutes )

app.use( '/users', Users )

app.use( '/auth', Auth )

app.use( '/suburbs', Suburb)

app.use( '/employee-rols', EmployeeRols )

const specs = swaggerJsdoc( options );
app.use( '/',swaggerUi.serve, swaggerUi.setup( specs ) );

module.exports = app;