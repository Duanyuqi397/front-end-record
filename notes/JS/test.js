function test(dirarr,docidarr){
  let filearr = [{docid:1},{docid:2},{docid:3},{docid:1}];
  return new Promise((resolve,reject) => {
    const uploadarr = [...new Set(filearr)].concat(...new Set(dirarr));
    // console.log(uploadarr)
    if(!docidarr.includes(uploadarr[0]?.docid)){
      console.log('come in')
      uploadarr[0]?.docid && docidarr.push(uploadarr[0].docid);
      resolve(uploadarr);
    }
  })
}

const res1 = test([{docid:99}],[1]);
const res2 = test([{docid:99}],[6]);
console.log(res1,res2);