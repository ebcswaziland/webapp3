import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ErrorBoundary from "./ErrorBoundary";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDns625k8bwUuNxw8f9mLVz_pH2956fWL8",
  authDomain: "ebc-app-aead3.firebaseapp.com",
  databaseURL: "https://ebc-app-aead3-default-rtdb.firebaseio.com",
  projectId: "ebc-app-aead3",
  storageBucket: "ebc-app-aead3.appspot.com",
  messagingSenderId: "789710588741",
  appId: "1:789710588741:web:b5b19e63a97625bada4c2c",
  measurementId: "G-YPVE7EW8HK",
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const MyPDF = ({ data, titles }) => {
  // Sort data in descending order of totalSecondaryVotes
  data.sort((a, b) => b.totalSecondaryVotes - a.totalSecondaryVotes);

  return (
    <Page size="A3">
      <View style={styles.container}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Surname</Text>
          <Text style={styles.headerCell}>Chiefdom</Text>
          <Text style={styles.headerCell}>Inkhundla</Text>
          <Text style={styles.headerCell}>Region</Text>
          <Text style={styles.headerCell}>INMATES</Text>
          <Text style={styles.headerCell}>DIASPORA</Text>
          <Text style={styles.headerCell}>SPECIAL</Text>
          {/* <Text style={styles.headerCell}>Secondary</Text> */}
          <Text style={styles.headerCell}>Total</Text>
        </View>

        {titles.map((title, index) => (
          <React.Fragment key={index}>
            <Text style={styles.title}>{title}</Text>
            {data[index].map((nominee, i) => {
              // Calculate the total secondary votes for the nominee
              const secondaryVotes = nominee.secondary_votes || {};
              const inmates = parseInt(secondaryVotes.INMATE) || 0;
              const diaspora = parseInt(secondaryVotes.DIASPORA) || 0;
              const special = parseInt(secondaryVotes.SPECIAL) || 0;
              const totalSecondaryVotes = Object.values(
                nominee.secondary_votes || {}
              ).reduce((total, votes) => total + parseInt(votes || 0), 0);

              const SecondaryVotesTotal = Object.entries(secondaryVotes).reduce(
                (total, [key, votes]) => {
                  if (
                    key !== "INMATE" &&
                    key !== "DIASPORA" &&
                    key !== "SPECIAL"
                  ) {
                    return total + parseInt(votes || 0);
                  }
                  return total;
                },
                0
              );

              return (
                <View key={i} style={styles.nominee}>
                  <Text style={styles.cell}>{nominee.name || "N/A"}</Text>
                  <Text style={styles.cell}>{nominee.surname || "N/A"}</Text>
                  <Text style={styles.cell}>{nominee.chiefdom || "N/A"}</Text>
                  <Text style={styles.cell}>{nominee.inkhundla || "N/A"}</Text>
                  <Text style={styles.cell}>{nominee.region || "N/A"}</Text>
                  <Text style={styles.cell}>{inmates || "0"}</Text>
                  <Text style={styles.cell}>{diaspora || "0"}</Text>
                  <Text style={styles.cell}>{special || "0"}</Text>
                  {/* <Text style={styles.cell}>{SecondaryVotesTotal || "0"}</Text> */}
                  <Text style={styles.cell}>{totalSecondaryVotes || "0"}</Text>
                </View>
              );
            })}
          </React.Fragment>
        ))}
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0074e4",
    color: "#ffffff",
    padding: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    // textAlign: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
  },
  nominee: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    flex: 1,
  },
});

function Reports() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const poll = localStorage.getItem("mypolling2");
  const primary_poll = localStorage.getItem("mypolling");

  useEffect(() => {
    const fetchNomineeData = async () => {
      try {
        const urls = [
          `${poll}/Secondary/MP/nominees`,
          `${poll}/Secondary/Indvuna/nominees`,
          `${primary_poll}/Bucopho/nominees`,
        ];

        const dataPromises = urls.map(async (url) => {
          const querySnapshot = await getDocs(collection(firestore, url));
          const nominees = querySnapshot.docs.map((doc) => doc.data());

          // Simulate a delay for demonstration purposes
          await new Promise((resolve) => setTimeout(resolve, 1000));

          nominees.forEach((nominee) => {
            const secondaryVotes = nominee.secondary_votes || {};
            const inmates = parseInt(secondaryVotes.INMATE) || 0;
            const diaspora = parseInt(secondaryVotes.DIASPORA) || 0;
            const special = parseInt(secondaryVotes.SPECIAL) || 0;
            const SecondaryVotesTotal = Object.entries(secondaryVotes).reduce(
              (total, [key, votes]) => {
                if (
                  key !== "INMATE" &&
                  key !== "DIASPORA" &&
                  key !== "SPECIAL"
                ) {
                  return total + parseInt(votes || 0);
                }
                return total;
              },
              0
            );

            const totalSecondaryVotes =
              inmates + diaspora + special + SecondaryVotesTotal;

            nominee.totalSecondaryVotes = totalSecondaryVotes;
          });

          return nominees;
        });

        const nomineesData = await Promise.all(dataPromises);

        setData(nomineesData);
        setIsLoading(false);

        console.log("Fetched Data:", nomineesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Simulate a 3-second delay before starting to fetch data
    const delay = 3000;
    const interval = 100;
    let currentProgress = 0;

    const loadingInterval = setInterval(() => {
      currentProgress += (interval / delay) * 100;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(loadingInterval);
        fetchNomineeData();
      }
    }, interval);

    return () => {
      clearInterval(loadingInterval);
    };

    // fetchNomineeData();
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        {isLoading ? (
          // Show loading indicator or message
          Loader()
        ) : (
          <PDFViewer width="100%" height="700px">
            <Document>
              <MyPDF
                data={data}
                titles={[
                  //MP Gege
                  "MP",
                  "INDVUNA",
                  "BUCOPHO",
                ]}
              />
            </Document>
          </PDFViewer>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default Reports;
