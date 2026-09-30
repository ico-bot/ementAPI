import sqlite3

try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute('SELECT codigo_curso, nome_curso FROM curso WHERE codigo_curso LIKE "%30%"')
    for row in cursor.fetchall():
        print(row)
    conn.close()
except Exception as e:
    print(e)
