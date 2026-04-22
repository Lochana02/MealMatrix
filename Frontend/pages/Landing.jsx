import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="bg-[#fef9ed] text-[#1d1c15] selection:bg-orange-200">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            <div className="lg:col-span-7 z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-200 text-green-800 text-xs font-bold tracking-widest uppercase">
                <span className="material-symbols-outlined text-[14px]">
                  restaurant_menu
                </span>
                Seasonally Curated
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-orange-800 leading-[0.95] tracking-tighter">
                Heirloom Nutrition, <br />
                <span className="italic font-extralight text-stone-700">
                  Modernly Served.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-stone-600 max-w-xl font-medium leading-relaxed">
                Experience the rhythm of the local harvest at The Editorial
                Canteen. Chef-driven meals designed for the workplace.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-br from-orange-800 to-orange-600 text-white font-extrabold tracking-tight shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                  Browse Today's Menu
                </button>

                <button className="px-8 py-4 rounded-xl bg-stone-200 text-stone-900 font-bold tracking-tight hover:bg-stone-300 transition-colors">
                  Our Story
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7J4WGfJRd_n3oJpi4P-e9a6oY4RBQKjPVF_ydLaKpTgQO69TP3z3G4P9OQfgE8XMnxFJR3gc72I3FiFNxkN3WhE4l7_OqLGki0gCM2buMXd7nfBJVgn-kP69D7THJ9t1onHRd1mVkk-EnRjnr5RGgpZak2hpsTjOXaCiMs1VdE_DzZAhX1PVcMOkbyhVdV0w1J62W3napdo9ABLq34b7HYh-_yUlPd8SYID4kISIOTeJZbXYHCPUuxFWvpsV_hAFFUxPv81_85bXw"
                  alt="Grain bowl with roasted vegetables"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 aspect-square w-48 rounded-3xl overflow-hidden shadow-xl -rotate-6 hidden md:block">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCISJhaKQH43gxvCd9gGQq1g7F2q4XGwYaTwGET9FyYimkqmIE2qWgRcEsiIT-kh2UCkVaCU12NXNoj24-2z2KGVKRONifhh7aNf_tRPQ673fQlaRQetw23z8f9RuV6yBj8yRxB5ALaXp-BVyFWPkPlU7aUFQTdvKqiPO1F3Gnxeu6hAtqIBi7PctrWsd8yzwrLC9eClk5uyRvRev1eXOr2NlJ23bzOLaasgsAY_cyZckCaL9i4W_a7WMbE0RD2hIaNt3ssZFeqDENm"
                  alt="Chef plating garnish"
                />
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-stone-100 to-transparent opacity-50"></div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
                  <span className="material-symbols-outlined text-3xl">
                    local_grocery_store
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
                  Local Ingredients
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Sourced from independent farms within 50 miles, ensuring peak
                  nutritional value and seasonal flavor.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
                  <span className="material-symbols-outlined text-3xl">
                    skillet
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
                  Artisanal Technique
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Our culinary team applies classical techniques to modern
                  workplace dining, elevating every bite.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined text-3xl">
                    eco
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
                  Sustainable Sourcing
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Zero-waste kitchen initiatives and compostable packaging at
                  every point of service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section id="categories" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
                  Daily Curation
                </h2>
                <p className="text-stone-600 font-medium mt-2">
                  Explore our core culinary pillars.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
              <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] shadow-xl bg-stone-200">
                <img
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6eSdQMh89qpHzGWa_qyLhVuBT_FLpXOjQ8n-iukknLUKna2MyjkI5wuMdtihMGachWasJaenX-utapTw7KytUMuNOmySRPapWT6V8DEAAeAkCd_cIvWOXkWgC82S9vdPTncYcy1xLJsE-yn0RGti5_f-RFmp9el0C7B-uCZWOdM2bregVnZBiC4qve17A53HSNUdj_I1wyXjinqYdIm0Bx6_GBCcF9Cx8dFLisRTemqnpPDmbcOby01oCwmkhaiUeqVQ5Yxs4SK1K"
                  alt="Breakfast spread"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-white/80 uppercase tracking-widest text-xs font-bold">
                    Start Strong
                  </span>
                  <h3 className="text-3xl text-white font-black font-['Plus_Jakarta_Sans'] mt-1">
                    Breakfast
                  </h3>
                </div>
              </div>

              <div className="md:col-span-4 group relative overflow-hidden rounded-[2rem] shadow-xl bg-stone-200">
                <img
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ7ihgyLXLC7PseMa8EZ29MGxYXqPHhq3uAs__LyblerQeDmrdLclKkiDHm-YsA1hhhN68Ywt-5zYZmeBd_F9tYG6ph0y9ViM308bmMcviYCk4H-zl1LulVQN8L2_eqMJHlfymTuUe9RIaWDKbO4x98LYDlyr7Ml0b5zgUDYCa50ujbMcODxFHQKUU-R35YDEHYfYS6l3ySp5BAIJJCFbrGzuFShCVz3gqSZKmwn8EMDnarLX4a_J-GxDFn1CmYzmHAE9d8ERke2en"
                  alt="Lunch salad"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-white/80 uppercase tracking-widest text-xs font-bold">
                    Peak Performance
                  </span>
                  <h3 className="text-3xl text-white font-black font-['Plus_Jakarta_Sans'] mt-1">
                    Lunch
                  </h3>
                </div>
              </div>

              <div className="md:col-span-4 group relative overflow-hidden rounded-[2rem] shadow-xl bg-stone-200 h-[300px] md:h-auto">
                <img
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlpa_3C2UT35VRzHhQ8YU3k-0Ddo7fBM0hRNVEhKFy47L6esvuBzP0dopxlPOqN0MxVkwQJzH3dU_WrEOgR74zqOKa8QoUjKoTGWC9NgmGHQ9nBRTDy7q-6mhRTYRQ9tYdLHh_kPDLcwEy1K0Ydq_IHl9Tbpw4EXCqb-JxSzwr9MUv04APTc1Q1eCAmN38Zjd9Ksl2HERzRAXFoaU0qe32KwZBLE9U-RuQEbNgaoWcIldvWdaQYs-aPc4kDU0vwQGA8RGVdTFiy-YP"
                  alt="Healthy snacks"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-white/80 uppercase tracking-widest text-xs font-bold">
                    Quick Fuel
                  </span>
                  <h3 className="text-3xl text-white font-black font-['Plus_Jakarta_Sans'] mt-1">
                    Snacks
                  </h3>
                </div>
              </div>

              <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] shadow-xl bg-stone-200 h-[300px] md:h-auto">
                <img
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnOpjr0V7YV6phQwhnyq_unbD79UQ55aaSbLqWhnXNzmO2ERQAdlykfYK0bjupLUD6XyEf-eRnY7gDvKOECgKhml8Ohan3hulyay7U9yaVW1xz9ldJct8qQ2V6co8FFBRcdKNqm5jX_7BCnLK1kVd9e_0vmNzvZXTLdmHL3NaKofHoSxh841d7ZUajka9VA0uE7_nZrEIROmYe0R-v32wAJR8PFWIdXy7PNMhAkPoSaKU5lit4Jpmy0QB4XZBsgKXey_Ne4zx5j9oU"
                  alt="Drinks"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-white/80 uppercase tracking-widest text-xs font-bold">
                    Hydration
                  </span>
                  <h3 className="text-3xl text-white font-black font-['Plus_Jakarta_Sans'] mt-1">
                    Drinks
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-6">
                Our Mission
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter mb-8 leading-tight">
                Beyond the Standard Canteen.
              </h2>

              <p className="text-xl text-stone-600 font-medium leading-relaxed italic mb-8 border-l-4 border-orange-200 pl-8">
                "We believe the workplace shouldn't just be where you work, but
                where you flourish. Heirloom Ledger was born from a desire to
                bridge the gap between farm-to-table dining and the daily office
                ritual."
              </p>

              <p className="text-lg text-stone-600 leading-relaxed">
                Our mission is to provide nourishing, chef-driven meals that
                respect both the producer and the consumer. By partnering
                directly with local farmers and employing high-end culinary
                talent, we transform corporate nutrition into a daily moment of
                connection and delight.
              </p>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <img
                  className="rounded-3xl w-full aspect-[3/4] object-cover shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp_7hMZdVRWanDsNvhIb65uisuqzYP5VMpAgzIVuJpktT_UpISyut0Rw_hTzwnapu4uFwdydonEFoWpN-xqRF4r4aTmOoxMEPlIKb0fT75c5W5XuoqkT3pc3ekVc8W6XEbOFvRv_3J5T8r09tqQTp-YSfrJKYW8KYenD6_ZFSkNwNuNNAMENoxWwVDejFrdp80ftofonbFafz_78XyPWM9bjyiPcywcFZSQ813mwQ6ScEOZbYlv_lw4CNjiVRi8BsYvF_pfCMXxQHe"
                  alt="Chef portrait"
                />
                <img
                  className="rounded-3xl w-full aspect-square object-cover shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk_uyAVkaj1DI9_f8bScvAtrQAM9pSmCn8un9SrFolSZoNh74lB3jmwyKDfTSAeMmaIHk_d1XohrZhyQSrhr8CbKQXiTDIqvt46BdNOoUOcvMe-lNlRm5ApO9n4Bs0EjNNIG7GGaOgpPa7pBFLgtvx20kJnLLnQ0ND185ANVOIaMWDfb5iWoktdbLWrN3puMxARwJUSxeXjdA0vySolJt2r1TbFbKtNmEuzhD3V48pU7IHnTNjylBjWZgcBP3tWyAYlDf1D3L9Eiwz"
                  alt="Fresh vegetables"
                />
              </div>

              <div className="space-y-4">
                <img
                  className="rounded-3xl w-full aspect-square object-cover shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_xSA9dApDndIQUIMjUQj9AQbzQSIu2mYCT2julS3dCQoIWZ0BOX0turhgr3PgpoH_WFba3cXc_E8MtYibj8smHSpYJ3VXUmJWbpqKUb9fZ0ET6CYL0JtqCnhyIZh-TcSEtiuu12cHsD2pN3z2Eb8zp6fNoi0LwEJG1NKVuJP1AMQTr2YZiocAidlrHlJXHg3lmmHecPMQ93kHcuSRrbg50obepvpn9a2D4v9lBfwgHUTrj6JlPCNnjBIqF3449DQ2Lw6OGadhT0C"
                  alt="Canteen interior"
                />
                <img
                  className="rounded-3xl w-full aspect-[3/4] object-cover shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVu6Vb0r2vEI3cbO9Q-K76uec2i3LSRQvdID2ibcOSPm0g6aUlt2-HVoGiWRT7lQPDItbLaEYkEpwpggyFtnWzM-Isd_fmgljO8cA_fGAldVZYGBJzmSJ6bK9cPV_GZXOi-0KDqkQXFCzQDwayzBOteYItohvzDu2Q7TAsSByQGL62BfJgj953gyNZnQpxGnFSeQqXuyjQtq7tlldpnRjdzkgubKw-tcpVRbeyn9UWuR2WxkFBm-HFrVTSuuG0IscgAKS-hf7iqsR5"
                  alt="Microgreens plating"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-stone-200 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
                Join the Table
              </h2>
              <p className="text-xl text-stone-600 font-medium">
                Subscribe for daily menu updates and exclusive stories from our
                farming partners.
              </p>

              <form className="flex flex-col md:flex-row gap-4 mt-8">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-blue-500 transition-all text-stone-900 placeholder:text-stone-400 outline-none"
                />
                <button className="px-8 py-4 rounded-xl bg-orange-800 text-white font-extrabold hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                  Sign Me Up
                </button>
              </form>

              <p className="text-xs text-stone-500 pt-4">
                We value your privacy. Unsubscribe at any time.
              </p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/40 via-transparent to-green-100/40 -z-0"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;