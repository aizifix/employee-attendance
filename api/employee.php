<?php

session_start();  // Start the session

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'connection.inc.php';  // Database connection file


// Employee Class for Employee Operations
class Employee {

    // Function to fetch user details
    function fetchUserDetails() {
        global $conn;

        // Check if employee_id is set in the session
        if (!isset($_SESSION['employee_id'])) {
            error_log("Unauthorized access: no employee_id in session. Session data: " . print_r($_SESSION, true));
            return json_encode(['success' => false, 'message' => 'Unauthorized access']);
        }

        $employee_id = $_SESSION['employee_id'];

        try {
            error_log("Fetching user details for employee_id: " . $employee_id);
            $sql = "SELECT first_name, last_name, email FROM tbl_employee WHERE employee_id = :employee_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                error_log("User found: " . json_encode($user));
                return json_encode([
                    'success' => true,
                    'name' => $user['first_name'] . ' ' . $user['last_name'],
                    'employee_id' => $employee_id // Return employee_id for frontend
                ]);
            } else {
                error_log("User not found for employee_id: " . $employee_id);
                return json_encode(['success' => false, 'message' => 'User not found']);
            }
        } catch (PDOException $e) {
            error_log("Database error fetching user details: " . $e->getMessage());
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to request leave for an employee
    function requestLeave($data) {
        global $conn;

        // Validate the required fields
        if (!isset($data['leave_type'], $data['description'], $data['start_date'], $data['end_date'])) {
            error_log("Missing required fields in leave request: " . json_encode($data));
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $leave_type = $data['leave_type'];
        $description = $data['description'];
        $start_date = $data['start_date'];
        $end_date = $data['end_date'];
        $status = 'pending';  // Default status for a leave request

        if (!isset($_SESSION['employee_id'])) {
            error_log("Unauthorized access: no employee_id in session");
            return json_encode(['success' => false, 'message' => 'Unauthorized access']);
        }
        $employee_id = $_SESSION['employee_id'];  // Get the logged-in employee ID

        try {
            error_log("Submitting leave request for employee_id: " . $employee_id);
            error_log("Leave details: " . json_encode($data));

            // Insert the leave request into the database
            $sql = "INSERT INTO tbl_leave (employee_id, leave_type, description, start_date, end_date, status)
                    VALUES (:employee_id, :leave_type, :description, :start_date, :end_date, :status)";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
            $stmt->bindParam(':leave_type', $leave_type, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':start_date', $start_date, PDO::PARAM_STR);
            $stmt->bindParam(':end_date', $end_date, PDO::PARAM_STR);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);

            $stmt->execute();

            error_log("Leave request submitted successfully for employee_id: " . $employee_id);
            return json_encode(['success' => true, 'message' => 'Leave request submitted successfully']);
        } catch (PDOException $e) {
            error_log("Database error submitting leave request: " . $e->getMessage());
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Other methods...
}

// Handle operations based on HTTP method
$operation = $_GET['operation'] ?? null;
$data = json_decode(file_get_contents('php://input'), true);

$employee = new Employee();

switch ($operation) {
    case 'fetchUserDetails':
        echo $employee->fetchUserDetails();
        break;
    
    case 'requestLeave':
        echo $employee->requestLeave($data);
        break;

    default:
        error_log("Invalid operation requested: " . $operation);
        echo json_encode(['success' => false, 'message' => 'Invalid operation']);
        break;
}
?>
