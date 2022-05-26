/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json';
    xhr.onload = function () {
        options.callback(null, this.response)
    }
    xhr.onerror = function (event) {
        options.callback(event.target.status);
    }
    if(options.method === 'GET') {
        if(options.data) {
            const params = Object.keys(options.data).map(element => {
                return `${element}=${options.data[element]}`
            }).join('&');
            xhr.open(options.method, `${options.url}?${params}`);
        } else {
            xhr.open(options.method, options.url);
        }
        xhr.send();
    } else {
        const formData = new FormData;
        if (options.data) {
            Object.keys(options.data).forEach(element => {
                formData.append(element, `${options.data[element]}`)
            })                
        }
        xhr.open(options.method, options.url);
        xhr.send(formData);
    }
};