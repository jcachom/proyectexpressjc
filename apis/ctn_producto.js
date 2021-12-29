class ctn_producto {
    constructor() {
        this.listProductos = []
        this.id = 0
    }

    listar_x_id(id) {      
        let respuesta =null ;
        if(listProductos.length>0){
        respuesta = this.listProductos.find(item => item.id == id)
        }  
        return    (respuesta==null) ? { error : 'producto no encontrado' } : respuesta;                
    }

    listar_todo() {
         
        if (this.listProductos.length==0){
         return  { error : 'producto no encontrado' };
        }else {
          return  [...this.listProductos]        
        } 

    }

    guardar(prod) {
        this.id=this.id + 1 ;
        const new_producto = { ...prod, id: this.id }
        this.listProductos.push(new_producto)
        return new_producto
    }

    actualizar(prod, id) {
        const new_producto = { id: Number(id), ...prod }
        const index = this.listProductos.findIndex(item => item.id == id)
        if (index !== -1) {
            this.listProductos[index] = new_producto
            return new_producto
        } else {
            return { error: 'producto no encontrado' }
        }
    }

    borrar_x_id(id) {
        const index = this.listProductos.findIndex(item => item.id == id)
        if (index !== -1) {
            return this.listProductos.splice(index, 1)
        } else {
            return { error: 'producto no encontrado' }
        }
    }
}

module.exports = ctn_producto
