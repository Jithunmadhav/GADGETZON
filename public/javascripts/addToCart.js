

function addToCart(proId){
    $.ajax({
        url:'/addToCart/'+proId,
        method:'get',
        success:(response)=>{
            alert(response)
        }
    })
}