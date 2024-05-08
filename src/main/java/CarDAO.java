import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CarDAO {
    private static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/car_database";
    private static final String USER = "root";
    private static final String PASSWORD = "root";

    public List<Car> getAllCars() throws SQLException {
        List<Car> cars = new ArrayList<>();
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            stmt = conn.createStatement();
            String sql = "SELECT * FROM car";
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Car car = new Car(
                        rs.getString("make"),
                        rs.getString("model"),
                        rs.getString("engine"),
                        rs.getInt("year"),
                        rs.getString("transmission"),
                        rs.getInt("id")
                );
                cars.add(car);
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }

        return cars;
    }

    public void addCar(Car car) throws SQLException {
        Connection conn = null;
        PreparedStatement preparedStatement = null;

        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            String sql = "INSERT INTO car (make, model, engine, year, transmission) VALUES (?, ?, ?, ?, ?)";
            preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, car.getMake());
            preparedStatement.setString(2, car.getModel());
            preparedStatement.setString(3, car.getEngine());
            preparedStatement.setInt(4, car.getYear());
            preparedStatement.setString(5, car.getTransmission());
            preparedStatement.executeUpdate();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        } finally {
            if (preparedStatement != null) preparedStatement.close();
            if (conn != null) conn.close();
        }
    }
    public void deleteCar(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement preparedStatement = null;

        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            String sql = "DELETE FROM car WHERE id = ?";
            preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        } finally {
            if (preparedStatement != null) preparedStatement.close();
            if (conn != null) conn.close();
        }
    }

    public void updateCar(Car car) throws SQLException {
        Connection conn = null;
        PreparedStatement preparedStatement = null;

        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            String sql = "UPDATE car SET make = ?, model = ?, engine = ?, year = ?, transmission = ? WHERE id = ?";
            preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, car.getMake());
            preparedStatement.setString(2, car.getModel());
            preparedStatement.setString(3, car.getEngine());
            preparedStatement.setInt(4, car.getYear());
            preparedStatement.setString(5, car.getTransmission());
            preparedStatement.setInt(6, car.getId());
            preparedStatement.executeUpdate();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        } finally {
            if (preparedStatement != null) preparedStatement.close();
            if (conn != null) conn.close();
        }
    }


}
