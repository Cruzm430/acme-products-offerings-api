const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/acme_db');
const {UUID, UUIDV4, STRING, DECIMAL} = Sequelize;

const Product = conn.define('products', {
  id:{
    type:UUID,
    primaryKey:true,
    defaultValue:UUIDV4
  },
  name:{
    type: STRING,
    allowNull:false
  },
  suggestedPrice:{
    type:DECIMAL,
    allowNull:false
  }
})

const Company = conn.define('companies', {
  id:{
    type:UUID,
    primaryKey:true,
    defaultValue:UUIDV4
  },
  name:{
    type:STRING,
    allowNull:false
  }
})

const Offering = conn.define('offering',{
  id:{
    type:UUID,
    primaryKey:true,
    defaultValue:UUIDV4
  },
  price:{
    type: DECIMAL(10,2),
    allowNull:false
  }
})

Product.hasMany(Offering);
Company.hasMany(Offering);

const map = (model,data) => data.map(item=>model.create(item))

const syncAndSeed = async() =>{
  await conn.sync({force:true});
  
  const products = [
    {name: 'thing1', suggestedPrice:7},
    {name: 'thing2', suggestedPrice:8},
    {name: 'thing3', suggestedPrice:9}
  ]
  const [thing1,thing2,thing3] = await Promise.all(map(Product,products))

  const companies =[
    {name:'company1'},
    {name:'company2'},
    {name:'company3'}
  ]
  const [company1,company2,company3] = await Promise.all(map(Company,companies))

  const offerings =[
    {productId:thing1.id, companyId:company1.id, price:4.3},
    {productId:thing1.id, companyId:company1.id, price:4.2},
    {productId:thing1.id, companyId:company1.id, price:4.0},
    {productId:thing2.id, companyId:company2.id, price:4.3},
    {productId:thing2.id, companyId:company3.id, price:4.9},
    {productId:thing3.id, companyId:company3.id, price:2},
  ]
  const [off1, off2, off3, off4, off5, off6] = await Promise.all(map(Offering,offerings))
}

module.exports ={
  syncAndSeed,
  models:{
    Product,
    Company,
    Offering
  }
}

// syncAndSeed();