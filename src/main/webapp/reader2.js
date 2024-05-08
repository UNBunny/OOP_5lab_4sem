document.addEventListener('DOMContentLoaded', function () {
    const carList = document.getElementById('carList');
    let carsData;

    function loadCars() {
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
                <button onclick="deleteCar(${car.id})">Удалить</button>
                <button onclick="editCar(${car.id})">Редактировать</button>
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

    // Function to open modal dialog for editing car
    window.editCar = function(carId) {
        const car = carsData.find(car => car.id === carId);
        if (!car) {
            console.error('Car not found');
            return;
        }

        const modal = document.getElementById('editModal');
        const modalMake = modal.querySelector('#make');
        const modalModel = modal.querySelector('#model');
        const modalEngine = modal.querySelector('#engine');
        const modalYear = modal.querySelector('#year');
        const modalTransmission = modal.querySelector('#transmission');

        modalMake.value = car.make;
        modalModel.value = car.model;
        modalEngine.value = car.engine;
        modalYear.value = car.year;
        modalTransmission.value = car.transmission;

        modal.style.display = 'block';
    }

// Function to save changes made in modal dialog
    window.saveChanges = function (carId) {
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const engine = document.getElementById('engine').value;
        const year = document.getElementById('year').value;
        const transmission = document.getElementById('transmission').value;

        const updatedCar = {
            id: carId,
            make: make,
            model: model,
            engine: engine,
            year: year,
            transmission: transmission
        };

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://localhost:8080/OOP_5lab_4sem_war_exploded/car/' + carId, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                // Reload cars list after successful update
                loadCars();
                closeDialog(); // Close dialog after saving changes
            } else {
                console.error('Error updating car:', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify(updatedCar));
    }

// Function to close modal dialog
    window.closeDialog = function () {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';

        // Clear input fields
        modal.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
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
    loadCars()


});