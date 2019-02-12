import pg from 'pg';
const { Pool } = pg;

(async () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    // database: 'mydb',
    password: process.env.POSTGRES_PASSWORD,
  });

  console.log("0");
  await new Promise(res => setTimeout(res, 1000));
  console.log("1");
  await new Promise(res => setTimeout(res, 2000));
  console.log("2");
  await new Promise(res => setTimeout(res, 3000));
  console.log("3");
  await new Promise(res => setTimeout(res, 4000));
  console.log("4");
  await new Promise(res => setTimeout(res, 5000));
  console.log("5");
  await new Promise(res => setTimeout(res, 6000));
  console.log("6");
  
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
  });
})();
