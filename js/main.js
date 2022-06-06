var web = new Vue({
    el: '#app',
    data: {
        searchValue: '',
        showProduct: true,
        flow: 'Ascending',
        lessons: [],
        cart: [],
        sortType: '',
        firstName: "",
        lastName: "",
        phoneNumber: ""
    },
    methods: {
        getLessons: function () {
            fetch("http://localhost:3000/collection/lessons")
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.lessons = data
                    console.log(data)
                })

                .catch(err => {
                    lessons = "unable to get lessons data"
                    console.log("unable to get lessons list")
                })
        },
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },
        addToCart(lesson) {
            if (lesson.stock >= 1) {
                let InCart = false
                if (this.cartCount() >= 1) {
                    for (let i = 0; i < this.cart.length; i++) {
                        if (this.cart[i].id == lesson._id) {
                            this.cart[i].stock += 1
                            InCart = true
                            break
                        }
                    }
                    if (InCart == false) {
                        let item = {}
                        item.id = lesson._id
                        item.stock = 1
                        this.cart.push(item)
                    }
                }
                else {
                    let item = {}
                    item.id = lesson._id
                    item.stock = 1
                    this.cart.push(item)
                }
                lesson.stock -= 1
            }
            else {
                lesson.stock = 0
            }
            console.log(this.cart)
        },
        removeItem(id) {
            let showcart = this.cart
            let less = this.lessons
            for (let i = 0; i < showcart.length; i++) {
                console.log(showcart[i].id)
                if (id == showcart[i].id) {
                    showcart.splice(i, 1)

                }
            }
            for (let i = 0; i < less.length; i++) {
                console.log(less[i].id)
                if (id == less[i].id) {
                    less[i].stock += 1

                }
            }
        },
        checkPage() {
            let checkout = []
            for (let i = 0; i < this.cart.length; i++) {
                for (let k = 0; k < this.lessons.length; k++) {
                    if (this.lessons[k]._id == this.cart[i].id) {
                        let item = {}
                        item.id = this.cart[i].id
                        item.subject = this.lessons[k].subject
                        item.location = this.lessons[k].location
                        item.price = this.lessons[k].price
                        item.images = this.lessons[k].images
                        item.stock = this.cart[i].stock
                        checkout.push(item)
                    }
                }
            }
            return checkout
        },
        checkOut(){
            let order = {
                name: this.firstName +' '+this.lastName,
                phone_number: this.phoneNumber,
                items: this.cart
            }
            let order_string = (JSON.stringify(order))
            fetch('http://localhost:3000/collection/orders', {
                method: "POST",
                body: order_string,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(json_response => {
                console.log(json_response)
                this.orderClose()
            })
            .catch(err => console.log(err))
        },
        orderClose(){
            let stockNew = []
            let showcart = this.cart
            
            for (let i = 0; i < showcart.length; i++) {
                for (let j = 0; j < this.lessons.length; j++) {
                    if (showcart[i].id == this.lessons[j]._id) {
                        let item = {
                            id: showcart[i].id,
                            stock: this.lessons[j].stock
                        }
                        stockNew.push(item)
                    }
                }
            }
            let stockString = (JSON.stringify(stockNew))
            fetch('http://localhost:3000/collection/lessons', {
                method: "PUT",
                body: stockString,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    alert('Order Successfully')
                    this.firstName = ''
                    this.lastName = ''
                    this.phoneNumber = ''
                    showcart.splice(0, showcart.length)
                })
                .catch(err => console.log(err))
            if (this.firstName == '' && this.lastName == '' && this.phoneNumber == '' && this.cart.length == 0) {
                alert('Error')
            }
        },
        sortPrice: function (arr) {
            function compare(a, b) {
                if (a.price > b.price)
                    return 1;
                if (a.price < b.price)
                    return -1;
                return 0;
            }
            return arr.sort(compare);
        },
        sortSubject: function (arr) {
            function compare(a, b) {
                if (a.subject > b.subject)
                    return 1;
                if (a.subject < b.subject)
                    return -1;
                return 0;
            }
            return arr.sort(compare);
        },
        sortLocation: function (arr) {
            function compare(a, b) {
                if (a.location > b.location)
                    return 1;
                if (a.location < b.location)
                    return -1;
                return 0;
            }
            return arr.sort(compare);
        },
        sortAvailable: function (arr) {
            function compare(a, b) {
                if (a.stock > b.stock)
                    return 1;
                if (a.stock < b.stock)
                    return -1;
                return 0;
            }
            return arr.sort(compare);
        },
        sortedArray: function() {
            let allLessons = this.lessons
            // allLessons = allLessons.filter((lesson) => {
            //     return lesson.subject.toLowerCase().match(this.searchValue.toLowerCase()) || lesson.location.toLowerCase().match(this.searchValue.toLowerCase())
            // })
            if (this.sortType == 'price') {
                allLessons = this.sortPrice(allLessons)
            }
            else if (this.sortType == 'subject') {
                allLessons = this.sortSubject(allLessons)
            }
            else if (this.sortType == 'location') {
                allLessons = this.sortLocation(allLessons)
            }
            else if (this.sortType == 'available') {
                allLessons = this.sortAvailable(allLessons)
            }
            if (this.flow == 'ascending') {
                return allLessons
            }
            else if (this.flow == 'descending') {
                return allLessons.reverse()
            }
            return allLessons
        },
        cartCount() {
            return this.cart.length
        }
    },
    computed: {
        cartItemNum: function () {
            return this.cart.length
        },
    },
    created() {
        this.getLessons()
    }
})
