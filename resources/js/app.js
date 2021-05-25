require('./bootstrap');

window.Vue = require('vue').default;
// imports
import VueRouter from 'vue-router';
import { HasError, AlertError, } from 'vform/src/components/bootstrap5'
import { Form } from 'vform'
import moment from 'moment';
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import Swal from 'sweetalert2'

// use throughout the app 
window.Toast = Toast;
window.Fire = new Vue();
window.Swal = Swal;
window.Form = Form;


// constant options progress bar
const options = {
    color: 'green',
    failedColor: 'red',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    location: 'top',

}

// const options for sweet alert
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


// vue.use for components usage 
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.use(VueRouter);
Vue.use(VueProgressBar, options)
Vue.component('example-component', require('./components/ExampleComponent.vue').default);


// routes
let routes = [
    { path: '/dashboard', component: require('./components/dashboard.vue').default },
    { path: '/profile', component: require('./components/profile.vue').default },
    { path: '/users', component: require('./components/users.vue').default }


]

// add router
const router = new VueRouter({
    mode: 'history',
    routes
})

// vue filters for apploication
Vue.filter('upperCase', function(value) {

    return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('mydate', function(created) {
    return moment(created).format('MMMM Do YYYY');

})






const app = new Vue({
    el: '#app',
    router

});