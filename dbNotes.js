const Sequelize = require('sequelize');
const {UUID, UUIDV4, STRING, DECIMAL} = Sequelize;
const conn = new Sequelize('postgres://localhost/notes_db')

const idDef ={
  primaryKey:true,
  type:UUID,
  defaultValue:UUIDV4
}

const User = conn.define('user',{
  id:idDef,
  firstName:{
    type:STRING,
    allowNull:false
  },
  lastName:{
    type:STRING,
    allowNull:false
  }
})

const Story = conn.define('story',{
  id:idDef,
  title:{
    type: STRING
  }
})
const Review = conn.define('review',{
  id:idDef,
  rating:{
    type:DECIMAL
  }
})

Story.belongsTo(User, {as: 'author'})
User.hasMany(Story,{foreignKey:'authorId'})

Review.belongsTo(User);
User.hasMany(Review);

Review.belongsTo(Story);
Story.hasMany(Review);

const map = (model,data) =>data.map(item => model.create(item));

const syncAndSeed = async() =>{
  await conn.sync({force:true})
  const users = [
    {firstName:'a', lastName:'b'},
    {firstName:'c', lastName:'d'},
    {firstName:'e', lastName:'f'}
  ]
  const [a,c,e] = await Promise.all(map(User,users));
  const stories =[
    {title:'asd', authorId:a.id},
    {title:'woo', authorId:c.id},
    {title:'yuh', authorId:e.id}
  ]
  const [asd, woo, yuh] = await Promise.all(map(Story,stories));
  const reviews = [
    {userId:a.id, storyId: asd.id, rating:2},
    {userId:c.id, storyId: woo.id, rating:2}
  ]
  const [ew,ar] =await Promise.all(map(Review,reviews))
}

module.exports={
  syncAndSeed,
  models:{
    User,
    Story,
    Review
  }
}