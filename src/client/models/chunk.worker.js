/* eslint-env worker */

onmessage = function(e) {
  
  const name = e.data.name;
  const sender = e.data.sender;
  const data = e.data.data;
    switch (name) {  
      
      case 'start':
        console.log(sender,name);
       
        break
    case 'contar':
      console.log(sender,name);
      for (let index = 0; index < 10; index++) {
        console.log('cont',index);
        setInterval(() => {         
        }, 100)
       
        
      }
     
      break
      case 'retorno':
        console.log(sender,name);
     
        break
    
  }
  
  
}
  
