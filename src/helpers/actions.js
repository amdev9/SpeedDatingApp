export default actions = {
    connected: function() {
        return {
            type: 'CONNECTION',
            status: 'connected'
        }
    },
    disconnected: function() {
        return {
            type: 'CONNECTION',
            status: 'disconnected'
        }
    },
    connecting: function() {
        return {
            type: 'CONNECTION',
            status: 'connecting'
        }
    },
    messageReceived: function(msg) {
        return {
            type: 'MESSAGE_RECEIVED',
            data: msg
        }
    }
}
