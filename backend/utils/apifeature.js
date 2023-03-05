class ApiFeatuers {
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    };

search(){
    const keyword =this.queryStr.keyword ?{
     "$or":[
        { "name":{
            $regex:this.queryStr.keyword,
            $options:"i",  //for caseinsensitive accept both capital and small alphabet
        }},
        {"category":{
            $regex:this.queryStr.keyword,
            $options:"i",  //for caseinsensitive accept both capital and small alphabet

        }},
        
     ]
      
    }:{};
    console.log(keyword)

    this.query = this.query.find({...keyword});
    return this;
}


}

module.exports=ApiFeatuers