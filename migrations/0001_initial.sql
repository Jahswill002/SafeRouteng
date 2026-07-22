CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('parent', 'matron', 'admin'))
);

CREATE TABLE IF NOT EXISTS Buses (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    route TEXT NOT NULL,
    driver TEXT,
    matron TEXT,
    capacity INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('idle', 'en_route', 'arrived')),
    speedKph INTEGER DEFAULT 0,
    etaMin INTEGER DEFAULT 0,
    distanceKm REAL DEFAULT 0,
    progress REAL DEFAULT 0,
    currentStop TEXT,
    nextStop TEXT
);

CREATE TABLE IF NOT EXISTS Students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT,
    guardian_email TEXT NOT NULL,
    busId TEXT NOT NULL,
    pickupStop TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('awaiting', 'boarded', 'absent', 'dropped')),
    FOREIGN KEY(guardian_email) REFERENCES Users(email),
    FOREIGN KEY(busId) REFERENCES Buses(id)
);

CREATE TABLE IF NOT EXISTS AlertEvents (
    id TEXT PRIMARY KEY,
    busId TEXT NOT NULL,
    studentId TEXT,
    kind TEXT NOT NULL CHECK (kind IN ('pre_alert', 'boarded', 'en_route', 'arrived', 'sos', 'delay')),
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(busId) REFERENCES Buses(id),
    FOREIGN KEY(studentId) REFERENCES Students(id)
);

-- Seed Data (Demo Accounts)
INSERT OR IGNORE INTO Users (id, email, password_hash, role) VALUES 
('usr_parent1', 'parent@demo.ng', 'demo1234', 'parent'),
('usr_matron1', 'matron@demo.ng', 'demo1234', 'matron'),
('usr_admin1', 'admin@demo.ng', 'demo1234', 'admin');

-- Seed Buses
INSERT OR IGNORE INTO Buses (id, label, route, driver, matron, capacity, status, speedKph, etaMin, distanceKm, progress, currentStop, nextStop) VALUES 
('bus_04', 'Bus 04', 'Lekki - V/I - Ikoyi', 'Oluwaseun', 'matron@demo.ng', 30, 'en_route', 40, 15, 8.5, 0.4, 'Lekki Phase 1', 'Victoria Island'),
('bus_07', 'Bus 07', 'Yaba - Surulere', 'Chinedu', 'Jane', 25, 'idle', 0, 0, 0, 0, 'School', 'School'),
('bus_12', 'Bus 12', 'Ajah - VGC', 'Ade', 'Mary', 40, 'arrived', 0, 0, 0, 1, 'School', 'School'),
('bus_19', 'Bus 19', 'Ikoyi - Obalende', 'Emeka', 'Sarah', 20, 'en_route', 35, 10, 5, 0.6, 'Obalende', 'Ikoyi');

-- Seed Students
INSERT OR IGNORE INTO Students (id, name, grade, guardian_email, busId, pickupStop, status) VALUES 
('std_01', 'Aisha', 'Grade 3', 'parent@demo.ng', 'bus_04', 'Lekki Phase 1', 'boarded'),
('std_02', 'Bolu', 'Grade 5', 'parent@demo.ng', 'bus_04', 'Victoria Island', 'awaiting'),
('std_03', 'Chioma', 'Grade 2', 'other@demo.ng', 'bus_04', 'Lekki Phase 1', 'boarded'),
('std_04', 'David', 'Grade 4', 'other2@demo.ng', 'bus_07', 'Yaba', 'awaiting'),
('std_05', 'Emmanuella', 'Grade 1', 'other3@demo.ng', 'bus_07', 'Surulere', 'awaiting'),
('std_06', 'Femi', 'Grade 6', 'other4@demo.ng', 'bus_12', 'Ajah', 'dropped'),
('std_07', 'Grace', 'Grade 3', 'other5@demo.ng', 'bus_12', 'VGC', 'dropped'),
('std_08', 'Hassan', 'Grade 4', 'other6@demo.ng', 'bus_19', 'Ikoyi', 'boarded'),
('std_09', 'Idris', 'Grade 5', 'other7@demo.ng', 'bus_19', 'Obalende', 'boarded'),
('std_10', 'Joy', 'Grade 2', 'other8@demo.ng', 'bus_04', 'Lekki Phase 1', 'absent'),
('std_11', 'Kemi', 'Grade 1', 'other9@demo.ng', 'bus_07', 'Yaba', 'awaiting');

-- Seed Alerts
INSERT OR IGNORE INTO AlertEvents (id, busId, studentId, kind, message, timestamp) VALUES 
('alt_01', 'bus_04', NULL, 'pre_alert', 'Bus 04 is approaching Lekki Phase 1 in 5 mins', datetime('now', '-30 minutes')),
('alt_02', 'bus_04', 'std_01', 'boarded', 'Aisha has boarded Bus 04', datetime('now', '-25 minutes')),
('alt_03', 'bus_04', 'std_10', 'boarded', 'Joy is absent', datetime('now', '-24 minutes')),
('alt_04', 'bus_04', NULL, 'en_route', 'Bus 04 is en route to Victoria Island', datetime('now', '-10 minutes')),
('alt_05', 'bus_12', NULL, 'arrived', 'Bus 12 has safely arrived at School', datetime('now', '-5 minutes'));
