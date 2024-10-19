<?php


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'connection.inc.php';

// Class Admin to handle the operations
class Admin {

    // Function to fetch all departments
    function fetchDepartments() {
        global $conn;

        try {
            $sql = "SELECT * FROM tbl_department";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'departments' => $departments]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to fetch all employees
    function fetchEmployees() {
        global $conn;

        try {
            $sql = "SELECT e.employee_id, e.first_name, e.last_name, 
                        e.email, e.phone_number, e.status, d.department_name 
                    FROM tbl_employee e
                    LEFT JOIN tbl_department d ON e.department_id = d.department_id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'employees' => $employees]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to fetch all sites
    function fetchSites() {
        global $conn;

        try {
            $sql = "SELECT * FROM tbl_site";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $sites = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'sites' => $sites]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to add a new employee
    function addEmployee($data) {
        global $conn;

        if (!isset($data['first_name'], $data['last_name'], $data['department_id'], $data['email'], $data['phone_number'], $data['username'], $data['password'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $department_id = $data['department_id'];
        $email = $data['email'];
        $phone_number = $data['phone_number'];
        $username = $data['username'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $status = $data['status'] ?? 'active';

        try {
            $sql = "INSERT INTO tbl_employee (first_name, last_name, department_id, email, phone_number, username, password, status) 
                    VALUES (:first_name, :last_name, :department_id, :email, :phone_number, :username, :password, :status)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':first_name', $first_name);
            $stmt->bindParam(':last_name', $last_name);
            $stmt->bindParam(':department_id', $department_id);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone_number', $phone_number);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':status', $status);

            $stmt->execute();

            $employee_id = $conn->lastInsertId(); 
            return json_encode(['success' => true, 'employee_id' => $employee_id]);

        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Function to add a new site
    function addSite($data) {
        global $conn;

        if (!isset($data['site_name'], $data['site_location'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $site_name = $data['site_name'];
        $site_location = $data['site_location'];
        $status = $data['status'] ?? 'active'; 

        try {
            $sql = "INSERT INTO tbl_site (site_name, site_location, status) 
                    VALUES (:site_name, :site_location, :status)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':site_name', $site_name, PDO::PARAM_STR);
            $stmt->bindParam(':site_location', $site_location, PDO::PARAM_STR);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);  

            $stmt->execute();

            $site_id = $conn->lastInsertId(); 
            return json_encode(['success' => true, 'site_id' => $site_id]);

        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Function to add a new shift
    function addShift($data) {
        global $conn;

        if (!isset($data['employee_id'], $data['site_id'], $data['shift_date'], $data['shift_start_time'], $data['shift_end_time'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $employee_id = $data['employee_id'];
        $site_id = $data['site_id'];
        $shift_date = $data['shift_date'];
        $shift_start_time = $data['shift_start_time'];
        $shift_end_time = $data['shift_end_time'];

        try {
            $sql = "INSERT INTO tbl_shifts (employee_id, site_id, shift_date, shift_start_time, shift_end_time) 
                    VALUES (:employee_id, :site_id, :shift_date, :shift_start_time, :shift_end_time)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
            $stmt->bindParam(':site_id', $site_id, PDO::PARAM_INT);
            $stmt->bindParam(':shift_date', $shift_date, PDO::PARAM_STR);
            $stmt->bindParam(':shift_start_time', $shift_start_time, PDO::PARAM_STR);
            $stmt->bindParam(':shift_end_time', $shift_end_time, PDO::PARAM_STR);

            $stmt->execute();

            $shift_id = $conn->lastInsertId(); 
            return json_encode(['success' => true, 'shift_id' => $shift_id]);

        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Function to fetch all shifts
    function fetchShifts() {
        global $conn;

        try {
            $sql = "SELECT s.shift_id, e.employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, 
                            si.site_name, s.shift_date, s.shift_start_time, s.shift_end_time
                    FROM tbl_shifts s
                    LEFT JOIN tbl_employee e ON s.employee_id = e.employee_id
                    LEFT JOIN tbl_site si ON s.site_id = si.site_id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $shifts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'shifts' => $shifts]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to add attendance if the employee is valid and assigned to the site
    function addAttendance($data) {
        global $conn;

        if (!isset($data['username'], $data['site_id'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $username = $data['username'];
        $site_id = $data['site_id'];

        try {
            // Check if the employee exists
            $sql = "SELECT employee_id FROM tbl_employee WHERE LOWER(username) = LOWER(:username)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();
            $employee = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($employee) {
                $employee_id = $employee['employee_id'];

                // Check if the employee is assigned to the inputted site_id
                $sqlCheckSite = "SELECT * FROM tbl_shifts WHERE employee_id = :employee_id AND site_id = :site_id";
                $stmtCheckSite = $conn->prepare($sqlCheckSite);
                $stmtCheckSite->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
                $stmtCheckSite->bindParam(':site_id', $site_id, PDO::PARAM_INT);
                $stmtCheckSite->execute();
                $shiftAssignment = $stmtCheckSite->fetch(PDO::FETCH_ASSOC);

                if (!$shiftAssignment) {
                    return json_encode(['success' => false, 'message' => 'Employee not assigned to this site.']);
                }

                // Check if the employee has already checked in today at the correct site
                $sqlCheck = "SELECT * FROM tbl_attendance WHERE employee_id = :employee_id AND site_id = :site_id AND date = :date";
                $stmtCheck = $conn->prepare($sqlCheck);
                $stmtCheck->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
                $stmtCheck->bindParam(':site_id', $site_id, PDO::PARAM_INT);
                $stmtCheck->bindParam(':date', date('Y-m-d'), PDO::PARAM_STR);
                $stmtCheck->execute();
                $existingAttendance = $stmtCheck->fetch(PDO::FETCH_ASSOC);

                if ($existingAttendance && $existingAttendance['check_out_time'] === null) {
                    // If there is an existing check-in record but no check-out, update with check-out time
                    $sqlUpdate = "UPDATE tbl_attendance SET check_out_time = :check_out_time 
                                  WHERE employee_id = :employee_id AND site_id = :site_id AND date = :date";
                    $stmtUpdate = $conn->prepare($sqlUpdate);
                    $stmtUpdate->bindParam(':check_out_time', date('H:i:s'), PDO::PARAM_STR);
                    $stmtUpdate->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
                    $stmtUpdate->bindParam(':site_id', $site_id, PDO::PARAM_INT);
                    $stmtUpdate->bindParam(':date', date('Y-m-d'), PDO::PARAM_STR);
                    $stmtUpdate->execute();

                    return json_encode(['success' => true, 'message' => 'Check-out recorded successfully']);
                } elseif (!$existingAttendance) {
                    // Insert check-in record if no check-in exists
                    $sqlAttendance = "INSERT INTO tbl_attendance (employee_id, site_id, date, check_in_time, status) 
                                      VALUES (:employee_id, :site_id, :date, :check_in_time, 'present')";
                    $stmtAttendance = $conn->prepare($sqlAttendance);
                    $stmtAttendance->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
                    $stmtAttendance->bindParam(':site_id', $site_id, PDO::PARAM_INT);
                    $stmtAttendance->bindParam(':date', date('Y-m-d'), PDO::PARAM_STR);
                    $stmtAttendance->bindParam(':check_in_time', date('H:i:s'), PDO::PARAM_STR);
                    $stmtAttendance->execute();

                    return json_encode(['success' => true, 'message' => 'Check-in recorded successfully']);
                } else {
                    return json_encode(['success' => false, 'message' => 'Attendance already completed for today']);
                }
            } else {
                return json_encode(['success' => false, 'message' => 'Invalid employee']);
            }
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    function updateAttendance($data) {
        global $conn;

        if (!isset($data['username'], $data['site_id'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $username = $data['username'];
        $site_id = $data['site_id'];

        try {
            // Get employee ID
            $sql = "SELECT employee_id FROM tbl_employee WHERE LOWER(username) = LOWER(:username)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();
            $employee = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($employee) {
                $employee_id = $employee['employee_id'];

                // Update attendance with check-out time
                $sqlUpdate = "UPDATE tbl_attendance SET check_out_time = :check_out_time 
                              WHERE employee_id = :employee_id AND site_id = :site_id AND date = :date";
                $stmtUpdate = $conn->prepare($sqlUpdate);
                $stmtUpdate->bindParam(':check_out_time', date('H:i:s'), PDO::PARAM_STR);
                $stmtUpdate->bindParam(':employee_id', $employee_id, PDO::PARAM_INT);
                $stmtUpdate->bindParam(':site_id', $site_id, PDO::PARAM_INT);
                $stmtUpdate->bindParam(':date', date('Y-m-d'), PDO::PARAM_STR);
                $stmtUpdate->execute(); 

                return json_encode(['success' => true, 'message' => 'Check-out recorded successfully']);
            } else {
                return json_encode(['success' => false, 'message' => 'Invalid employee']);
            }
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to fetch all attendance records
    function fetchAttendance() {
        global $conn;

        try {
            // Query to get all attendance records, joining with employee and site data
            $sql = "SELECT a.attendance_id, 
                           CONCAT(e.first_name, ' ', e.last_name) AS employee_name, 
                           s.site_name, 
                           a.date, 
                           a.check_in_time, 
                           a.check_out_time, 
                           a.status 
                    FROM tbl_attendance a
                    LEFT JOIN tbl_employee e ON a.employee_id = e.employee_id
                    LEFT JOIN tbl_site s ON a.site_id = s.site_id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'attendance' => $attendance]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Function to update the leave status (respond to leave request)
    function updateLeaveStatus($data) {
        global $conn;

        if (!isset($data['leave_id'], $data['status'])) {
            return json_encode(['success' => false, 'error' => 'Missing required fields']);
        }

        $leave_id = $data['leave_id'];
        $status = $data['status'];

        try {
            $sql = "UPDATE tbl_leave SET status = :status WHERE leave_id = :leave_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);
            $stmt->bindParam(':leave_id', $leave_id, PDO::PARAM_INT);

            $stmt->execute();
            return json_encode(['success' => true, 'message' => 'Leave status updated']);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Function to fetch all leave requests
    function fetchLeaves() {
        global $conn;

        try {
            // Fetch all leave requests with employee details from tbl_leave and tbl_employee
            $sql = "SELECT l.leave_id, 
                           CONCAT(e.first_name, ' ', e.last_name) AS employee_name, 
                           e.email, 
                           l.leave_type, 
                           l.description, 
                           l.start_date, 
                           l.end_date, 
                           l.status 
                    FROM tbl_leave l
                    LEFT JOIN tbl_employee e ON l.employee_id = e.employee_id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $leaves = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode(['success' => true, 'leaves' => $leaves]);
        } catch (PDOException $e) {
            return json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}

// Detect operation based on the HTTP method
$operation = null;
$data = [];

// If the request is GET
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['operation'])) {
    $operation = $_GET['operation'];
}
// If the request is POST
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (isset($data['operation'])) {
        $operation = $data['operation'];
    }
}

$admin = new Admin();

switch ($operation) {
    case 'updateLeaveStatus':
        echo $admin->updateLeaveStatus($data);
        break;

    case 'fetchAttendance':
        echo $admin->fetchAttendance();
        break;

    case 'fetchDepartments':
        echo $admin->fetchDepartments();
        break;

    case 'fetchEmployees':
        echo $admin->fetchEmployees();
        break;

    case 'fetchSites':
        echo $admin->fetchSites();
        break;

    case 'fetchLeaves':  // Fetch leave requests
        echo $admin->fetchLeaves();
        break;

    case 'addEmployee':
        echo $admin->addEmployee($data);
        break;

    case 'addSite':
        echo $admin->addSite($data);
        break;

    case 'addShift':
        echo $admin->addShift($data);
        break;

    case 'fetchShifts':
        echo $admin->fetchShifts();
        break;

    case 'addAttendance':
        echo $admin->addAttendance($data);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid operation']);
        break;
}
?>
