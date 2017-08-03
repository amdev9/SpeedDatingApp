<View style={styles.container}>
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}  
          >
            {event.participants.map((participant, index) => <Participant participant={participant} key={index}  onSelected={this.onSelected}/>)}
          </ScrollView>

          <TouchableHighlight
              underlayColor="#9575CD"
              style={styles.buttonContainer}
              onPress={this.start}
              >
              <Text style={styles.button}>Send results</Text>
          </TouchableHighlight> 
      </View>