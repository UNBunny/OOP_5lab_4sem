document.addEventListener('DOMContentLoaded', function () {
    const carList = document.getElementById('carList');
    let carsData;
    let currentCarId;
    window.myModal = new bootstrap.Modal(document.getElementById('editCarModal'));

    window.loadCars = function () {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/OOP_5lab_4sem_war_exploded/car', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                carsData = JSON.parse(xhr.responseText);
                displayCars(carsData);
            } else {
                console.error('Произошла ошибка при загрузке списка автомобилей:', xhr.statusText);
            }
        };

        xhr.send();
    }

    function displayCars(cars) {
        let tableHTML = `
        <table class="table table-striped table-bordered" style="width: 100%;">
            <thead class="thead-dark">
                <tr>
                    <th style="width: 20%;">Марка</th>
                    <th style="width: 20%;">Модель</th>
                    <th style="width: 20%;">Тип двигателя</th>
                    <th style="width: 20%;">Год выпуска</th>
                    <th style="width: 20%;">КПП</th>
                    <th style="width: 30%;">Действия</th> 
                </tr>
            </thead>
            <tbody>
    `;

        cars.forEach(function (car) {
            tableHTML += `
            <tr>
                <td>${car.make}</td>
                <td>${car.model}</td>
                <td>${car.engine}</td>
                <td>${car.year}</td>
                <td>${car.transmission}</td>
                <td>
                    <button onclick="editCar(${car.id})">Редактировать</button>
                    <button onclick="deleteCar(${car.id})">Удалить</button>
                </td>
            </tr>
        `;
        });

        tableHTML += `
            </tbody>
        </table>
    `;

        carList.innerHTML = tableHTML;
    }

    window.editCar = function (carId) {
        // Находим выбранный автомобиль в массиве данных
        const selectedCar = carsData.find(car => car.id === carId);

        document.getElementById('editMake').value = selectedCar.make;
        document.getElementById('editModel').value = selectedCar.model;
        document.getElementById('editEngine').value = selectedCar.engine;
        document.getElementById('editYear').value = selectedCar.year;
        document.getElementById('editTransmission').value = selectedCar.transmission;
        currentCarId = carId;
        myModal.show();
    }

    window.saveChanges = function () {
        // Получаем значения из модального окна
        const make = document.getElementById('editMake').value;
        const model = document.getElementById('editModel').value;
        const engine = document.getElementById('editEngine').value;
        const year = document.getElementById('editYear').value;
        const transmission = document.getElementById('editTransmission').value;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8080/OOP_5lab_4sem_war_exploded/car`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadCars();
                myModal.hide();
            } else {
                console.error('Произошла ошибка при сохранении изменений:', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            make: make,
            model: model,
            engine: engine,
            year: year,
            transmission: transmission,
            id: currentCarId
        }));
    }

    window.deleteCar = function (carId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:8080/OOP_5lab_4sem_war_exploded/car?id=${carId}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                loadCars(); // Обновляем список после успешного удаления
            } else {
                console.error('Произошла ошибка при удалении машины:', xhr.statusText);
            }
        };

        xhr.send();
        console.log("Удаление автомобиля с ID:", carId);
    }

    loadCars();
});

