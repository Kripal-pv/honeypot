import socket
import threading
import database
import time
import logging

logger = logging.getLogger(__name__)

class HoneypotService:
    def __init__(self):
        self.running = False
        self.threads = []
        self.sockets = []
        self.active_config = [] 

    def handle_connection(self, client_socket, address, port, service_type):
        ip = address[0]
        try:
            # Service Emulation Logic
            banner = b""
            if service_type == 'ftp':
                banner = b"220 FTP Server Ready\r\n"
            elif service_type == 'ssh':
                banner = b"SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\r\n"
            elif service_type == 'telnet':
                banner = b"Welcome to Microsoft Telnet Service \r\nlogin: "
            elif service_type == 'mysql':
                banner = b"\x4a\x00\x00\x00\x0a\x35\x2e\x35\x2e\x35\x2d\x31\x30\x2e\x34\x2e\x31\x33\x2d\x4d\x61\x72\x69\x61\x44\x42\x00\x0d\x00\x00\x00"
            
            if banner:
                client_socket.send(banner)

            client_socket.settimeout(5)
            try:
                data = client_socket.recv(1024)
                try:
                    payload = data.decode('utf-8')
                except:
                    payload = f"<Binary Data> {data.hex()}"
                
                if not payload:
                    payload = "<Connection without data>"
            except socket.timeout:
                payload = "<Connection Timeout / No Data>"
            except Exception as e:
                payload = f"<Error: {str(e)}>"

            print(f"[HIT] {service_type.upper()}://{ip}:{port}")
            database.add_log(ip, port, f"[{service_type.upper()}] {payload}")
            
            client_socket.close()
        except Exception as e:
            logger.error(f"Connection handler error: {e}")

    def start_listener(self, port_config):
        port = int(port_config['port'])
        service_type = port_config.get('type', 'generic')
        
        try:
            server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind(('0.0.0.0', port))
            server.listen(5)
            self.sockets.append(server)
            logger.info(f"Started listener on port {port}")
            
            while self.running:
                try:
                    server.settimeout(1.0)
                    client, addr = server.accept()
                    threading.Thread(target=self.handle_connection, args=(client, addr, port, service_type)).start()
                except socket.timeout:
                    continue
                except Exception as e:
                    if self.running: 
                        logger.error(f"Accept error on {port}: {e}")
                    break
        except PermissionError:
             logger.error(f"Permission denied for port {port}")
        except Exception as e:
            logger.error(f"Bind error on {port}: {e}")

    def start(self, config):
        if self.running:
            return "Already running"
        
        self.running = True
        self.sockets = []
        self.threads = []
        self.active_config = config
        
        for item in config:
            # Handle both object and int (backward compat)
            if isinstance(item, int):
                item = {'port': item, 'type': 'generic'}
            
            t = threading.Thread(target=self.start_listener, args=(item,))
            t.daemon = True
            t.start()
            self.threads.append(t)
        
        time.sleep(1.0) # Increased wait time for stability
        
        if not self.sockets:
             self.running = False
             return "Failed to bind any ports. Check permissions/conflicts."

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
