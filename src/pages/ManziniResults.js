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
                    <Text style={styles.headerCell}>Secondary</Text>
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
                                    <Text style={styles.cell}>{SecondaryVotesTotal || "0"}</Text>
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

function ManziniResults() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchNomineeData = async () => {
            try {
                const urls = [
                    //MP
                    "/Manzini/Kukhanyeni/Secondary/MP/nominees",
                    "/Manzini/Kwaluseni/Secondary/MP/nominees",
                    "/Manzini/Lamgabhi/Secondary/MP/nominees",
                    "/Manzini/Lobamba_Lomdzala/Secondary/MP/nominees",
                    "/Manzini/Ludzeludze/Secondary/MP/nominees",
                    "/Manzini/Mafutseni/Secondary/MP/nominees",
                    "/Manzini/Mahlangatsha/Secondary/MP/nominees",
                    "/Manzini/Mangcongco/Secondary/MP/nominees",
                    "/Manzini/Manzini_North/Secondary/MP/nominees",
                    "/Manzini/Manzini_South/Secondary/MP/nominees",
                    "/Manzini/Mhlambanyatsi/Secondary/MP/nominees",
                    "/Manzini/Mkhiweni/Secondary/MP/nominees",
                    "/Manzini/Mtfongwaneni/Secondary/MP/nominees",
                    "/Manzini/Ngwempisi/Secondary/MP/nominees",
                    "/Manzini/Nhlambeni/Secondary/MP/nominees",
                    "/Manzini/Nkomiyahlaba/Secondary/MP/nominees",
                    "/Manzini/Ntondozi/Secondary/MP/nominees",
                    "/Manzini/Phondo/Secondary/MP/nominees",


                    //Tindvuna
                    "/Manzini/Kukhanyeni/Secondary/Indvuna/nominees",
                    "/Manzini/Kwaluseni/Secondary/Indvuna/nominees",
                    "/Manzini/Lamgabhi/Secondary/Indvuna/nominees",
                    "/Manzini/Lobamba_Lomdzala/Secondary/Indvuna/nominees",
                    "/Manzini/Ludzeludze/Secondary/Indvuna/nominees",
                    "/Manzini/Mafutseni/Secondary/Indvuna/nominees",
                    "/Manzini/Mahlangatsha/Secondary/Indvuna/nominees",
                    "/Manzini/Mangcongco/Secondary/Indvuna/nominees",
                    "/Manzini/Manzini_North/Secondary/Indvuna/nominees",
                    "/Manzini/Manzini_South/Secondary/Indvuna/nominees",
                    "/Manzini/Mhlambanyatsi/Secondary/Indvuna/nominees",////////
                    "/Manzini/Mkhiweni/Secondary/MP/nominees",
                    "/Manzini/Mtfongwaneni/Secondary/MP/nominees",
                    "/Manzini/Ngwempisi/Secondary/MP/nominees",
                    "/Manzini/Nhlambeni/Secondary/MP/nominees",
                    "/Manzini/Nkomiyahlaba/Secondary/MP/nominees",
                    "/Manzini/Ntondozi/Secondary/MP/nominees",
                    "/Manzini/Phondo/Secondary/MP/nominees",


                    // bucopho Kukhanyeni
                    "/Manzini/Kukhanyeni/Bhekinkosi/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Maliyaduma/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Mbeka/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Mkhulamini/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Nkiliji/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Nswaceni/Bucopho/nominees",
                    "/Manzini/Kukhanyeni/Nyakeni/Bucopho/nominees",

                    // Bucopho Kwaluseni
                    "/Manzini/Kwaluseni/Kwaluseni/Bucopho/nominees",
                    "/Manzini/Kwaluseni/Logoba/Bucopho/nominees",
                    "/Manzini/Kwaluseni/Mhlane/Bucopho/nominees",

                    //Bucopho Lamgabhi
                    "/Manzini/Lamgabhi/Dvudvusini/Bucopho/nominees",
                    "/Manzini/Lamgabhi/Emhlangeni/Bucopho/nominees",
                    "/Manzini/Lamgabhi/LaMgabhi/Bucopho/nominees",
                    "/Manzini/Lamgabhi/Luhleko/Bucopho/nominees",
                    "/Manzini/Lamgabhi/Nhlulweni/Bucopho/nominees",

                    //Bucopho Lobamba_Lomdzala
                    "/Manzini/Lobamba_Lomdzala/Engweyameni/Bucopho/nominees",
                    "/Manzini/Lobamba_Lomdzala/Kufinyeni/Bucopho/nominees",
                    "/Manzini/Lobamba_Lomdzala/Luyengo/Bucopho/nominees",
                    "/Manzini/Lobamba_Lomdzala/Mahlanya/Bucopho/nominees",

                    //Bucopho Ludzeludze
                    "/Manzini/Ludzeludze/Kudzeni/Bucopho/nominees",
                    "/Manzini/Ludzeludze/Lozitha/Bucopho/nominees",
                    "/Manzini/Ludzeludze/Mbekelweni/Bucopho/nominees",
                    "/Manzini/Ludzeludze/Nkamanzi/Bucopho/nominees",
                    "/Manzini/Ludzeludze/Zombodze/Bucopho/nominees",

                    //Bucopho Mafutseni
                    "/Manzini/Mafutseni/Bhudla/Bucopho/nominees",
                    "/Manzini/Mafutseni/Ka_Nkambule/Bucopho/nominees",
                    "/Manzini/Mafutseni/Luhlokohla/Bucopho/nominees",
                    "/Manzini/Mafutseni/Mafutseni/Bucopho/nominees",
                    "/Manzini/Mafutseni/Ngculwini/Bucopho/nominees",
                    "/Manzini/Mafutseni/Timbutini/Bucopho/nominees",

                    //Bucopho Mahlangatsha
                    "/Manzini/Mahlangatsha/Bhahwini/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/KaZulu/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Ludvodvolweni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Luzelweni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Mahlangatsha/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Mambatfweni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Mgofelweni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Nciniselweni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Ndzeleni/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Nsangwini/Bucopho/nominees",
                    "/Manzini/Mahlangatsha/Sigcineni/Bucopho/nominees",

                    //Bucopho Mangcongco
                    "/Manzini/Mangcongco/Dwalile/Bucopho/nominees",
                    "/Manzini/Mangcongco/Mabhukwini/Bucopho/nominees",
                    "/Manzini/Mangcongco/Mangcongco_Zenukeni/Bucopho/nominees",
                    "/Manzini/Mangcongco/Sandlane_Ekuthuleni/Bucopho/nominees",

                    //Bucopho Manzini_North
                    "/Manzini/Manzini_North/Dvwaleni/Bucopho/nominees",
                    "/Manzini/Manzini_North/Makholweni/Bucopho/nominees",
                    "/Manzini/Manzini_North/Manzini_Central/Bucopho/nominees",
                    "/Manzini/Manzini_North/Mnyenyweni/Bucopho/nominees",
                    "/Manzini/Manzini_North/Mzimnene/Bucopho/nominees",
                    "/Manzini/Manzini_North/St_Pauls/Bucopho/nominees",

                    //Bucopho Manzini_South
                    "/Manzini/Manzini_South/Mhobodleni/Bucopho/nominees",
                    "/Manzini/Manzini_South/Mjingo/Bucopho/nominees",
                    "/Manzini/Manzini_South/Moneni/Bucopho/nominees",
                    "/Manzini/Manzini_South/Ngwane_Park/Bucopho/nominees",
                    "/Manzini/Manzini_South/Ticancweni/Bucopho/nominees",
                    "/Manzini/Manzini_South/Zakhele/Bucopho/nominees",

                    //Bucopho Mhlambanyatsi
                    "/Manzini/Mhlambanyatsi/Bhunya/Bucopho/nominees",
                    "/Manzini/Mhlambanyatsi/Dingizwe/Bucopho/nominees",
                    "/Manzini/Mhlambanyatsi/Lundzi/Bucopho/nominees",
                    "/Manzini/Mhlambanyatsi/Mbangave/Bucopho/nominees",
                    "/Manzini/Mhlambanyatsi/Mlindazwe/Bucopho/nominees",
                    "/Manzini/Mhlambanyatsi/Zondwako/Bucopho/nominees",///////

                    //Mkhiweni
                    "/Manzini/Mkhiweni/Dvokolwako/Bucopho/nominees",
                    "/Manzini/Mkhiweni/Ekutsimleni/Bucopho/nominees",
                    "/Manzini/Mkhiweni/Khuphuka/Bucopho/nominees",
                    "/Manzini/Mkhiweni/Mbelebeleni/Bucopho/nominees",
                    "/Manzini/Mkhiweni/Mnjoli_Likima/Bucopho/nominees",

                    // Mtfongwaneni
                    "/Manzini/Mtfongwaneni/Gundvwini/Bucopho/nominees",
                    "/Manzini/Mtfongwaneni/Hlane_Bulunga/Bucopho/nominees",
                    "/Manzini/Mtfongwaneni/Lwandle/Bucopho/nominees",
                    "/Manzini/Mtfongwaneni/Ndlandlameni/Bucopho/nominees",

                    // Ngwempisi bucopho end here from bottom
                    "/Manzini/Ngwempisi/Bhadzeni_1/Bucopho/nominees",
                    "/Manzini/Ngwempisi/Dladleni/Bucopho/nominees",
                    "/Manzini/Ngwempisi/Macundvulwini/Bucopho/nominees",
                    "/Manzini/Ngwempisi/Ngcoseni/Bucopho/nominees",
                    "/Manzini/Ngwempisi/Velezizweni/Bucopho/nominees",

                    // Nhlambeni
                    "/Manzini/Nhlambeni/Masundvwini/Bucopho/nominees",
                    "/Manzini/Nhlambeni/Mphankhomo/Bucopho/nominees",
                    "/Manzini/Nhlambeni/Ngonini/Bucopho/nominees",
                    "/Manzini/Nhlambeni/Njelu/Bucopho/nominees",

                    // Nkomiyahlaba
                    "/Manzini/Nkomiyahlaba/Eni/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Ngcayini/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Nsenga/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Nsingweni/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Ntunja/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Sibuyeni/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Sigombeni/Bucopho/nominees",
                    "/Manzini/Nkomiyahlaba/Vusweni/Bucopho/nominees",

                    // Ntondozi
                    "/Manzini/Ntondozi/Gebeni/Bucopho/nominees",
                    "/Manzini/Ntondozi/Khalangilile/Bucopho/nominees",
                    "/Manzini/Ntondozi/Mphini/Bucopho/nominees",
                    "/Manzini/Ntondozi/Ncabaneni/Bucopho/nominees",
                    "/Manzini/Ntondozi/Ndinda/Bucopho/nominees",
                    "/Manzini/Ntondozi/Ndlinilembi/Bucopho/nominees",
                    "/Manzini/Ntondozi/Ntondozi/Bucopho/nominees",

                    // Phondo
                    "/Manzini/Phondo/Bhadzeni_2/Bucopho/nominees",
                    "/Manzini/Phondo/Khabonina/Bucopho/nominees",
                    "/Manzini/Phondo/Lushikishini/Bucopho/nominees",
                    "/Manzini/Phondo/Mahhashini/Bucopho/nominees",
                    "/Manzini/Phondo/Mgazini/Bucopho/nominees",
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
                                    //MP
                                    "Kukhanyeni - MP",
                                    "Kwaluseni - MP",
                                    "Lamgabhi - MP",
                                    "Lobamba_Lomdzala - MP",
                                    "Ludzeludze - MP",
                                    "Mafutseni - MP",
                                    "Mahlangatsha - MP",
                                    "Mangcongco - MP",
                                    "Manzini_North - MP",
                                    "Manzini_South - MP",
                                    "Mhlambanyatsi - MP",
                                    "Mkhiweni - MP",
                                    "Mtfongwaneni - MP",
                                    "Ngwempisi - MP",
                                    "Nhlambeni - MP",
                                    "Nkomiyahlaba - MP",
                                    "Ntondozi - MP",
                                    "Phondo - MP",

                                    //Indvuna
                                    "Kukhanyeni - INDVUNA",
                                    "Kwaluseni - INDVUNA",
                                    "Lamgabhi - INDVUNA",
                                    "Lobamba_Lomdzala - INDVUNA",
                                    "Ludzeludze - INDVUNA",
                                    "Mafutseni - INDVUNA",
                                    "Mahlangatsha - INDVUNA",
                                    "Mangcongco - INDVUNA",
                                    "Manzini_North - INDVUNA",
                                    "Manzini_South - INDVUNA",
                                    "Mhlambanyatsi - INDVUNA",
                                    "Mkhiweni - INDVUNA",
                                    "Mtfongwaneni - INDVUNA",
                                    "Ngwempisi - INDVUNA",
                                    "Nhlambeni - INDVUNA",
                                    "Nkomiyahlaba - INDVUNA",
                                    "Ntondozi - INDVUNA",
                                    "Phondo - INDVUNA",


                                    //bucopho
                                    "Kukhanyeni - Bhekinkosi - Bucopho",
                                    "Kukhanyeni - Maliyaduma - Bucopho",
                                    "Kukhanyeni - Mbeka - Bucopho",
                                    "Kukhanyeni - Mkhulamini - Bucopho",
                                    "Kukhanyeni - Nkiliji - Bucopho",
                                    "Kukhanyeni - Nswaceni - Bucopho",
                                    "Kukhanyeni - Nyakeni - Bucopho",


                                    "Kwaluseni - Kwaluseni - Bucopho",
                                    "Kwaluseni - Logoba - Bucopho",
                                    "Kwaluseni - Mhlane - Bucopho",


                                    "Lamgabhi - Dvudvusini - Bucopho",
                                    "Lamgabhi - Emhlangeni - Bucopho",
                                    "Lamgabhi - LaMgabhi - Bucopho",
                                    "Lamgabhi - Luhleko - Bucopho",
                                    "Lamgabhi - Nhlulweni - Bucopho",

                                    "Lobamba_Lomdzala - Engweyameni - Bucopho",
                                    "Lobamba_Lomdzala - Kufinyeni - Bucopho",
                                    "Lobamba_Lomdzala - Luyengo - Bucopho",
                                    "Lobamba_Lomdzala - Mahlanya - Bucopho",

                                    "Ludzeludze - Kudzeni - Bucopho",
                                    "Ludzeludze - Lozitha - Bucopho",
                                    "Ludzeludze - Mbekelweni - Bucopho",
                                    "Ludzeludze - Nkamanzi - Bucopho",
                                    "Ludzeludze - Zombodze - Bucopho",

                                    "Mafutseni - Bhudla - Bucopho",
                                    "Mafutseni - Ka_Nkambule - Bucopho",
                                    "Mafutseni - Luhlokohla - Bucopho",
                                    "Mafutseni - Mafutseni - Bucopho",
                                    "Mafutseni - Ngculwini - Bucopho",
                                    "Mafutseni - Timbutini - Bucopho",

                                    "Mahlangatsha - Bhahwini - Bucopho",
                                    "Mahlangatsha - KaZulu - Bucopho",
                                    "Mahlangatsha - Ludvodvolweni - Bucopho",
                                    "Mahlangatsha - Luzelweni - Bucopho",
                                    "Mahlangatsha - Mahlangatsha - Bucopho",
                                    "Mahlangatsha - Mambatfweni - Bucopho",
                                    "Mahlangatsha - Mgofelweni - Bucopho",
                                    "Mahlangatsha - Nciniselweni - Bucopho",
                                    "Mahlangatsha - Ndzeleni - Bucopho",
                                    "Mahlangatsha - Nsangwini - Bucopho",
                                    "Mahlangatsha - Sigcineni - Bucopho",


                                    "Mangcongco - Dwalile - Bucopho",
                                    "Mangcongco - Mabhukwini - Bucopho",
                                    "Mangcongco - Mangcongco Zenukeni - Bucopho",
                                    "Mangcongco - Sandlane Ekuthuleni - Bucopho",

                                    "Manzini_North - Dvwaleni - Bucopho",
                                    "Manzini_North - Makholweni - Bucopho",
                                    "Manzini_North - Manzini Central - Bucopho",
                                    "Manzini_North - Mnyenyweni - Bucopho",
                                    "Manzini_North - Mzimnene - Bucopho",
                                    "Manzini_North - St Pauls - Bucopho",

                                    "Manzini_South - Mhobodleni - Bucopho",
                                    "Manzini_South - Mjingo - Bucopho",
                                    "Manzini_South - Moneni - Bucopho",
                                    "Manzini_South - Ngwane Park - Bucopho",
                                    "Manzini_South - Ticancweni - Bucopho",
                                    "Manzini_South - Zakhele - Bucopho",

                                    "Mhlambanyatsi - Bhunya - Bucopho",
                                    "Mhlambanyatsi - Dingizwe - Bucopho",
                                    "Mhlambanyatsi - Lundzi - Bucopho",
                                    "Mhlambanyatsi - Mbangave - Bucopho",
                                    "Mhlambanyatsi - Mlindazwe - Bucopho",
                                    "Mhlambanyatsi - Zondwako - Bucopho",

                                    "Mkhiweni - Dvokolwako - Bucopho",
                                    "Mkhiweni - Ekutsimleni - Bucopho",
                                    "Mkhiweni - Khuphuka - Bucopho",
                                    "Mkhiweni - Mbelebeleni - Bucopho",
                                    "Mkhiweni - Mnjoli Likima - Bucopho",

                                    "Mtfongwaneni - Gundvwini - Bucopho",
                                    "Mtfongwaneni - Hlane Bulunga - Bucopho",
                                    "Mtfongwaneni - Lwandle - Bucopho",
                                    "Mtfongwaneni - Ndlandlameni - Bucopho",


                                    "Ngwempisi - Bhadzeni 1 - Bucopho",
                                    "Ngwempisi - Dladleni - Bucopho",
                                    "Ngwempisi - Macundvulwini - Bucopho",
                                    "Ngwempisi - Ngcoseni - Bucopho",
                                    "Ngwempisi - Velezizweni - Bucopho",


                                    "Nhlambeni - Masundvwini - Bucopho",
                                    "Nhlambeni - Mphankhomo - Bucopho",
                                    "Nhlambeni - Ngonini - Bucopho",
                                    "Nhlambeni - Njelu - Bucopho",


                                    "Nkomiyahlaba - Eni - Bucopho",
                                    "Nkomiyahlaba - Ngcayini - Bucopho",
                                    "Nkomiyahlaba - Nsenga - Bucopho",
                                    "Nkomiyahlaba - Nsingweni - Bucopho",
                                    "Nkomiyahlaba - Ntunja - Bucopho",
                                    "Nkomiyahlaba - Sibuyeni - Bucopho",
                                    "Nkomiyahlaba - Sigombeni - Bucopho",
                                    "Nkomiyahlaba - Vusweni - Bucopho",

                                    "Ntondozi - Gebeni - Bucopho",
                                    "Ntondozi - Khalangilile - Bucopho",
                                    "Ntondozi - Mphini - Bucopho",
                                    "Ntondozi - Ncabaneni - Bucopho",
                                    "Ntondozi - Ndinda - Bucopho",
                                    "Ntondozi - Ndlinilembi - Bucopho",
                                    "Ntondozi - Ntondozi - Bucopho",

                                    "Phondo - Bhadzeni 2 - Bucopho",
                                    "Phondo - Khabonina - Bucopho",
                                    "Phondo - Lushikishini - Bucopho",
                                    "Phondo - Mahhashini - Bucopho",
                                    "Phondo - Mgazini - Bucopho",
                                ]}
                            />
                        </Document>
                    </PDFViewer>
                )}
            </ErrorBoundary>
        </div>
    );
}

export default ManziniResults;
