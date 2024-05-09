document.addEventListener('DOMContentLoaded', function () {
    const carList = document.getElementById('carList');
    let carsData;
    let currentCarId; // Добавляем переменную для хранения ID текущего автомобиля

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

    window.myModal = new bootstrap.Modal(document.getElementById('editCarModal'));

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
                    <th style="width: 20%;">Действия</th> <!-- Новая ячейка для кнопок -->
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
        // Заполняем модальное окно данными выбранного автомобиля
        document.getElementById('editMake').value = selectedCar.make;
        document.getElementById('editModel').value = selectedCar.model;
        document.getElementById('editEngine').value = selectedCar.engine;
        document.getElementById('editYear').value = selectedCar.year;
        document.getElementById('editTransmission').value = selectedCar.transmission;
        // Сохраняем ID текущего автомобиля
        currentCarId = carId;
        // Показываем модальное окно
        myModal.show();
    }

    window.saveChanges = function () {
        // Получаем значения из модального окна
        const make = document.getElementById('editMake').value;
        const model = document.getElementById('editModel').value;
        const engine = document.getElementById('editEngine').value;
        const year = document.getElementById('editYear').value;
        const transmission = document.getElementById('editTransmission').value;

        // Отправляем запрос на сервер для сохранения изменений
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `http://localhost:8080/OOP_5lab_4sem_war_exploded/car?id=${currentCarId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadCars(); // Обновляем список после успешного сохранения
                myModal.hide(); // Закрываем модальное окно
            } else {
                console.error('Произошла ошибка при сохранении изменений:', xhr.statusText);
            }
        };

        // Отправляем данные на сервер в формате JSON
        xhr.send(JSON.stringify({
            make: make,
            model: model,
            engine: engine,
            year: year,
            transmission: transmission,
            id : currentCarId
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

// Добавим обработчики событий для закрытия модального окна при нажатии на крестик или кнопку "Закрыть"
document.getElementById('editCarModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('editMake').value = '';
    document.getElementById('editModel').value = '';
    document.getElementById('editEngine').value = '';
    document.getElementById('editYear').value = '';
    document.getElementById('editTransmission').value = '';
});
