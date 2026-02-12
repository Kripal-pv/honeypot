import socket
import threading
import database

class HoneypotService:
    def __init__(self):
        self.running = False
        self.threads = []
        self.sockets = []
        # Default configuration
        self.config = {
            'ports': [21, 22, 80, 443, 8080],
            'custom_ports': []
        }

    def handle_connection(self, client_socket, address, port):
        ip = address[0]
        try:
            # Basic banner grabbing / emulation
            if port == 21:
                client_socket.send(b"220 FTP Server Ready\r\n")
            elif port == 22:
                client_socket.send(b"SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\r\n")
            elif port == 80 or port == 8080:
                 # Minimal HTTP response to keep scanner happy
                pass
            
            # Receive data (first packet usually contains interesting info)
            client_socket.settimeout(5)
            try:
                data = client_socket.recv(1024)
                payload = data.decode('utf-8', errors='ignore')
            except socket.timeout:
                payload = "<No Data>"
            except Exception as e:
                payload = f"<Error: {str(e)}>"

            print(f"[!] Connection from {ip}:{address[1]} on port {port} | Payload: {payload[:50]}...")
            database.add_log(ip, port, payload)
            
            client_socket.close()
        except Exception as e:
            print(f"Error handling connection: {e}")

    def start_listener(self, port):
        try:
            server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server.bind(('0.0.0.0', port))
            server.listen(5)
            self.sockets.append(server)
            print(f"[*] Listening on port {port}")
            
            while self.running:
                try:
                    server.settimeout(1.0)
                    client, addr = server.accept()
                    threading.Thread(target=self.handle_connection, args=(client, addr, port)).start()
                except socket.timeout:
                    continue
                except Exception as e:
                    if self.running: 
                        print(f"Error accepting connection on {port}: {e}")
                    break
        except Exception as e:
            print(f"Failed to bind port {port}: {e}")

    def start(self, selected_ports):
        if self.running:
            return "Already running"
        
        self.running = True
        self.sockets = []
        self.threads = []
        
        # Merge default and custom ports if needed, for now just use selected
        ports_to_listen = selected_ports if selected_ports else self.config['ports']

        for port in ports_to_listen:
            t = threading.Thread(target=self.start_listener, args=(int(port),))
            t.daemon = True
            t.start()
            self.threads.append(t)
        
        return "Started"

    def stop(self):
        self.running = False
        for s in self.sockets:
            try:
                s.close()
            except:
                pass
        self.sockets = []
        self.threads = []
        return "Stopped"

service = HoneypotService()
