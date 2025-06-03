"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Lightbulb, Target, CheckCircle, Users, Cog, Wrench } from "lucide-react"

export default function DesignResourcesPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - No Print */}
      <div className="print:hidden bg-white shadow-sm border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Design Resources Pack</h1>
            <p className="text-gray-600">Essential design acronyms and evaluation tools for NEA success</p>
          </div>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print All Resources
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div className="print-content container mx-auto py-6">
        <div className="print:block hidden">
          <h1 className="text-3xl font-bold text-center mb-2">Design Resources Pack</h1>
          <p className="text-center text-gray-600 mb-6">
            Essential design acronyms and evaluation tools for NEA success
          </p>
          <hr className="mb-6" />
        </div>

        <Tabs defaultValue="accessfm" className="w-full">
          <TabsList className="grid w-full grid-cols-6 print:hidden">
            <TabsTrigger value="accessfm">ACCESSFM</TabsTrigger>
            <TabsTrigger value="scamper">SCAMPER</TabsTrigger>
            <TabsTrigger value="smart">SMART Goals</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="design-process">Design Process</TabsTrigger>
            <TabsTrigger value="quick-reference">Quick Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="accessfm" className="space-y-6">
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6" />
                  ACCESSFM Analysis Framework
                </CardTitle>
                <CardDescription>
                  A systematic approach to analyzing existing products and developing design specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">A - Aesthetics</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        How does the product look, feel, sound, smell, or taste?
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What colors, textures, and finishes are used?</li>
                          <li>How does the shape and form appeal to users?</li>
                          <li>Does it follow current design trends?</li>
                          <li>How does it make the user feel?</li>
                          <li>What is the overall visual impact?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">C - Cost</h3>
                      <p className="text-sm text-gray-700 mb-2">How much does it cost to buy, make, and maintain?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What is the retail price?</li>
                          <li>How much do materials cost?</li>
                          <li>What are the manufacturing costs?</li>
                          <li>Are there ongoing maintenance costs?</li>
                          <li>Is it good value for money?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">C - Customer</h3>
                      <p className="text-sm text-gray-700 mb-2">Who is the target market and what are their needs?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Who is the primary target user?</li>
                          <li>What age group is it designed for?</li>
                          <li>What are their specific needs and wants?</li>
                          <li>How does it meet customer expectations?</li>
                          <li>What feedback do users give?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">E - Environment</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        What is the environmental impact throughout its lifecycle?
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What materials are used and are they sustainable?</li>
                          <li>How much energy is used in production?</li>
                          <li>Can it be recycled or disposed of safely?</li>
                          <li>What is the carbon footprint?</li>
                          <li>Does it use renewable resources?</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">S - Safety</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        How safe is the product to use, make, and dispose of?
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Are there any sharp edges or dangerous parts?</li>
                          <li>Does it meet safety standards and regulations?</li>
                          <li>Are there warning labels and instructions?</li>
                          <li>How safe is it for children to use?</li>
                          <li>What safety features are included?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="text-lg font-semibold text-yellow-700 mb-2">S - Size</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        What are the dimensions, weight, and scale considerations?
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What are the exact dimensions?</li>
                          <li>Is it the right size for its purpose?</li>
                          <li>How much does it weigh?</li>
                          <li>Is it portable or fixed in place?</li>
                          <li>Does size affect its function?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">F - Function</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        What is the product designed to do and how well does it work?
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What is its primary purpose?</li>
                          <li>Does it work as intended?</li>
                          <li>Are there any additional functions?</li>
                          <li>How reliable and durable is it?</li>
                          <li>Is it easy to use and understand?</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="text-lg font-semibold text-pink-700 mb-2">M - Materials</h3>
                      <p className="text-sm text-gray-700 mb-2">What materials are used and why were they chosen?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What materials are used in each part?</li>
                          <li>Why were these materials chosen?</li>
                          <li>What properties do the materials have?</li>
                          <li>Are they sustainable and recyclable?</li>
                          <li>How do materials affect cost and performance?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How to Use ACCESSFM:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Choose a product to analyze (existing product or competitor)</li>
                    <li>Work through each letter systematically</li>
                    <li>Take photos and make notes for each category</li>
                    <li>Rate each aspect (1-5 scale) and justify your rating</li>
                    <li>Identify strengths and weaknesses</li>
                    <li>Use findings to inform your own design specification</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scamper" className="space-y-6">
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-6 w-6" />
                  SCAMPER Creative Thinking Technique
                </CardTitle>
                <CardDescription>
                  A powerful brainstorming method to generate innovative design ideas by asking specific questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">S - Substitute</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be substituted or swapped?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What materials could be substituted?</li>
                          <li>What other processes could be used?</li>
                          <li>Can I use different components?</li>
                          <li>What if I used a different power source?</li>
                          <li>Could I substitute the location or environment?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Instead of wood, could I use recycled plastic?
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">C - Combine</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be combined or merged together?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What functions can be combined?</li>
                          <li>Can I merge two products into one?</li>
                          <li>What materials could work together?</li>
                          <li>Can I combine different technologies?</li>
                          <li>What if I blend different styles or approaches?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Combine a phone charger with a desk organizer
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">A - Adapt</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be adapted from something else?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What else is like this problem?</li>
                          <li>What could I copy or adapt from nature?</li>
                          <li>What ideas from other industries could work?</li>
                          <li>How have others solved similar problems?</li>
                          <li>What can I learn from the past?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Adapt bird wing design for wind turbine blades
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">M - Modify/Magnify</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be emphasized, enlarged, or exaggerated?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What can be made larger, stronger, or thicker?</li>
                          <li>What can be exaggerated or emphasized?</li>
                          <li>What can be duplicated or multiplied?</li>
                          <li>Can I add extra features or functions?</li>
                          <li>What if I increased the frequency or speed?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Make handles larger for better grip
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">P - Put to Other Use</h3>
                      <p className="text-sm text-gray-700 mb-2">How can this be used differently?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What else can this be used for?</li>
                          <li>Who else could use this?</li>
                          <li>How would a child use this differently?</li>
                          <li>Can it serve multiple purposes?</li>
                          <li>What if I used it in a different environment?</li>
                          <li>How could it be repurposed when broken?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Use old CDs as bird deterrents in gardens
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="text-lg font-semibold text-yellow-700 mb-2">E - Eliminate</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be removed, simplified, or reduced?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What can be removed without losing function?</li>
                          <li>Can I simplify the design?</li>
                          <li>What features are unnecessary?</li>
                          <li>Can I reduce the number of parts?</li>
                          <li>What if I eliminated certain steps in the process?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Remove buttons by using touch controls
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="text-lg font-semibold text-pink-700 mb-2">R - Reverse/Rearrange</h3>
                      <p className="text-sm text-gray-700 mb-2">What can be reversed, reordered, or turned around?</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What if I reversed the process?</li>
                          <li>Can I rearrange the components?</li>
                          <li>What if I turned it upside down?</li>
                          <li>Can I change the order of operations?</li>
                          <li>What if the user controlled it differently?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> Put controls on the bottom instead of top
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How to Use SCAMPER:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Start with your existing idea or a product you want to improve</li>
                    <li>Work through each letter of SCAMPER systematically</li>
                    <li>Ask the questions and brainstorm as many ideas as possible</li>
                    <li>Don't judge ideas initially - quantity over quality</li>
                    <li>Combine different SCAMPER techniques for more complex solutions</li>
                    <li>Evaluate and develop the most promising ideas further</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smart" className="space-y-6">
            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle className="h-6 w-6" />
                  SMART Goals Framework
                </CardTitle>
                <CardDescription>Create clear, achievable objectives for your design project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">S - Specific</h3>
                      <p className="text-sm text-gray-700 mb-2">Be clear and precise about what you want to achieve</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>What exactly do I want to accomplish?</li>
                          <li>Who is involved in this goal?</li>
                          <li>Where will this take place?</li>
                          <li>Why is this goal important?</li>
                          <li>What are the requirements and constraints?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> "Design a portable phone charging station for students in the school
                          library"
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">M - Measurable</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Include criteria to track progress and know when you've succeeded
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>How will I measure progress?</li>
                          <li>How will I know when the goal is accomplished?</li>
                          <li>What are the indicators of success?</li>
                          <li>How much, how many, how often?</li>
                          <li>What data will I collect?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> "Charge 4 devices simultaneously, 95% user satisfaction rating"
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">A - Achievable</h3>
                      <p className="text-sm text-gray-700 mb-2">Make sure the goal is realistic and attainable</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Do I have the necessary skills and resources?</li>
                          <li>Is this goal realistic given my constraints?</li>
                          <li>Have others successfully done this before?</li>
                          <li>What obstacles might I face?</li>
                          <li>Do I have enough time and budget?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> "Using available workshop tools and £50 budget"
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">R - Relevant</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Ensure the goal matters and aligns with your objectives
                      </p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Why is this goal important?</li>
                          <li>How does it fit with my other objectives?</li>
                          <li>Is this the right time for this goal?</li>
                          <li>Does it match my needs and priorities?</li>
                          <li>Will achieving this goal make a difference?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> "Addresses real problem of dead phone batteries affecting student
                          learning"
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">T - Time-bound</h3>
                      <p className="text-sm text-gray-700 mb-2">Set a clear deadline and timeline</p>
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Questions to ask:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>When will this goal be completed?</li>
                          <li>What are the key milestones?</li>
                          <li>What can I do today, this week, this month?</li>
                          <li>What is my deadline?</li>
                          <li>How will I track progress over time?</li>
                        </ul>
                        <p className="mt-2">
                          <strong>Example:</strong> "Complete prototype by Week 8, final product by Week 12"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">SMART Goal Template:</h4>
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>I will</strong> [Specific action] <strong>by</strong> [Time-bound deadline]
                    </p>
                    <p>
                      <strong>I will measure success by</strong> [Measurable criteria]
                    </p>
                    <p>
                      <strong>This is achievable because</strong> [Achievable reasoning]
                    </p>
                    <p>
                      <strong>This goal is relevant because</strong> [Relevant justification]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6" />
                  Evaluation Questions Bank
                </CardTitle>
                <CardDescription>
                  Comprehensive questions for testing and evaluating your design solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Functionality Testing</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Does the product work as intended?</li>
                        <li>How well does it perform its primary function?</li>
                        <li>Are there any functions that don't work properly?</li>
                        <li>How reliable is the product over time?</li>
                        <li>Does it meet the original design specification?</li>
                        <li>What happens when it's used incorrectly?</li>
                        <li>How does it perform under different conditions?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">User Experience</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>How easy is it to use for the first time?</li>
                        <li>Do users understand how to operate it without instructions?</li>
                        <li>What do users like most about the product?</li>
                        <li>What frustrates users when using it?</li>
                        <li>How long does it take to learn to use effectively?</li>
                        <li>Would users recommend it to others?</li>
                        <li>How does it compare to existing alternatives?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">Design Quality</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>How well is the product made?</li>
                        <li>Are the joints and connections secure?</li>
                        <li>Is the finish of professional quality?</li>
                        <li>How does it look compared to commercial products?</li>
                        <li>Are there any sharp edges or safety concerns?</li>
                        <li>How durable does it appear to be?</li>
                        <li>Does it look like the target market would want it?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">Environmental Impact</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>What materials were used and why?</li>
                        <li>How sustainable are the material choices?</li>
                        <li>Can the product be recycled at end of life?</li>
                        <li>How much energy does it use in operation?</li>
                        <li>What was the environmental cost of production?</li>
                        <li>Could more sustainable alternatives be used?</li>
                        <li>How does it compare environmentally to alternatives?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">Safety & Standards</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Is the product safe for its intended users?</li>
                        <li>Are there any potential hazards?</li>
                        <li>Does it meet relevant safety standards?</li>
                        <li>Are warning labels needed?</li>
                        <li>How safe is it for children to use?</li>
                        <li>What safety testing has been carried out?</li>
                        <li>How could safety be improved further?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">Cost & Value</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>How much did it cost to make?</li>
                        <li>What would be a fair selling price?</li>
                        <li>How does the cost compare to alternatives?</li>
                        <li>Is it good value for money?</li>
                        <li>Could costs be reduced without losing quality?</li>
                        <li>What are the most expensive components?</li>
                        <li>Would people pay the asking price?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="text-lg font-semibold text-pink-700 mb-2">Improvements & Future Development</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>What would you change if you made it again?</li>
                        <li>What additional features could be added?</li>
                        <li>How could the design be simplified?</li>
                        <li>What new technologies could be incorporated?</li>
                        <li>How could manufacturing be improved?</li>
                        <li>What would the next version look like?</li>
                        <li>How could it be adapted for different markets?</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-teal-500 pl-4">
                      <h3 className="text-lg font-semibold text-teal-700 mb-2">Market Potential</h3>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Who would buy this product?</li>
                        <li>How big is the potential market?</li>
                        <li>What is the competition like?</li>
                        <li>How would it be marketed and sold?</li>
                        <li>What makes it different from existing products?</li>
                        <li>Would it be profitable to manufacture?</li>
                        <li>How could it reach its target market?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Evaluation Methods:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Quantitative Methods:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                        <li>Performance testing with measurements</li>
                        <li>User surveys with rating scales</li>
                        <li>Load testing and stress testing</li>
                        <li>Time and motion studies</li>
                        <li>Cost analysis and comparison</li>
                      </ul>
                    </div>
                    <div>
                      <p>
                        <strong>Qualitative Methods:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                        <li>User interviews and feedback</li>
                        <li>Observation of use in context</li>
                        <li>Expert review and critique</li>
                        <li>Focus groups with target users</li>
                        <li>Comparative analysis with competitors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design-process" className="space-y-6">
            <Card>
              <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Cog className="h-6 w-6" />
                  Design Process Acronyms
                </CardTitle>
                <CardDescription>Additional frameworks and acronyms to support your design thinking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">IDEO Design Process</h3>
                      <p className="text-sm text-gray-700 mb-2">Human-centered design approach</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Empathize:</strong> Understand user needs
                        </li>
                        <li>
                          <strong>Define:</strong> Frame the problem clearly
                        </li>
                        <li>
                          <strong>Ideate:</strong> Generate creative solutions
                        </li>
                        <li>
                          <strong>Prototype:</strong> Build to think and test
                        </li>
                        <li>
                          <strong>Test:</strong> Learn from users
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">PIES Analysis</h3>
                      <p className="text-sm text-gray-700 mb-2">Analyze external factors affecting design</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Political:</strong> Laws, regulations, government policy
                        </li>
                        <li>
                          <strong>Economic:</strong> Cost, market conditions, funding
                        </li>
                        <li>
                          <strong>Environmental:</strong> Sustainability, climate impact
                        </li>
                        <li>
                          <strong>Social:</strong> Cultural trends, demographics, lifestyle
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">SWOT Analysis</h3>
                      <p className="text-sm text-gray-700 mb-2">Evaluate your design solution</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Strengths:</strong> What advantages does it have?
                        </li>
                        <li>
                          <strong>Weaknesses:</strong> What could be improved?
                        </li>
                        <li>
                          <strong>Opportunities:</strong> What potential is there?
                        </li>
                        <li>
                          <strong>Threats:</strong> What challenges exist?
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-orange-700 mb-2">AIDA Marketing</h3>
                      <p className="text-sm text-gray-700 mb-2">Present your design effectively</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Attention:</strong> Grab the audience's interest
                        </li>
                        <li>
                          <strong>Interest:</strong> Keep them engaged
                        </li>
                        <li>
                          <strong>Desire:</strong> Make them want the product
                        </li>
                        <li>
                          <strong>Action:</strong> Encourage them to act
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">MOSCOW Prioritization</h3>
                      <p className="text-sm text-gray-700 mb-2">Prioritize features and requirements</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Must have:</strong> Essential features
                        </li>
                        <li>
                          <strong>Should have:</strong> Important but not critical
                        </li>
                        <li>
                          <strong>Could have:</strong> Nice to have features
                        </li>
                        <li>
                          <strong>Won't have:</strong> Not in this version
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="text-lg font-semibold text-yellow-700 mb-2">LEAN Principles</h3>
                      <p className="text-sm text-gray-700 mb-2">Eliminate waste in design process</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Value:</strong> What does the customer value?
                        </li>
                        <li>
                          <strong>Value Stream:</strong> Map the process
                        </li>
                        <li>
                          <strong>Flow:</strong> Make it smooth
                        </li>
                        <li>
                          <strong>Pull:</strong> Respond to demand
                        </li>
                        <li>
                          <strong>Perfection:</strong> Continuous improvement
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">PDCA Cycle</h3>
                      <p className="text-sm text-gray-700 mb-2">Continuous improvement process</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Plan:</strong> Identify and analyze the problem
                        </li>
                        <li>
                          <strong>Do:</strong> Implement the solution
                        </li>
                        <li>
                          <strong>Check:</strong> Evaluate the results
                        </li>
                        <li>
                          <strong>Act:</strong> Standardize the solution
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="text-lg font-semibold text-pink-700 mb-2">RACI Matrix</h3>
                      <p className="text-sm text-gray-700 mb-2">Define roles and responsibilities</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          <strong>Responsible:</strong> Who does the work?
                        </li>
                        <li>
                          <strong>Accountable:</strong> Who is ultimately answerable?
                        </li>
                        <li>
                          <strong>Consulted:</strong> Who provides input?
                        </li>
                        <li>
                          <strong>Informed:</strong> Who needs to know?
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-reference" className="space-y-6">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wrench className="h-6 w-6" />
                  Quick Reference Guide
                </CardTitle>
                <CardDescription>At-a-glance summary of all design acronyms and frameworks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-700 border-b border-blue-200 pb-1">Analysis & Research</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">ACCESSFM</p>
                        <p className="text-xs text-gray-600">
                          Aesthetics, Cost, Customer, Environment, Safety, Size, Function, Materials
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">PIES</p>
                        <p className="text-xs text-gray-600">Political, Economic, Environmental, Social</p>
                      </div>
                      <div>
                        <p className="font-medium">SWOT</p>
                        <p className="text-xs text-gray-600">Strengths, Weaknesses, Opportunities, Threats</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-700 border-b border-green-200 pb-1">Creative Thinking</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">SCAMPER</p>
                        <p className="text-xs text-gray-600">
                          Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Design Thinking</p>
                        <p className="text-xs text-gray-600">Empathize, Define, Ideate, Prototype, Test</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-purple-700 border-b border-purple-200 pb-1">Planning & Goals</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">SMART</p>
                        <p className="text-xs text-gray-600">Specific, Measurable, Achievable, Relevant, Time-bound</p>
                      </div>
                      <div>
                        <p className="font-medium">MOSCOW</p>
                        <p className="text-xs text-gray-600">Must have, Should have, Could have, Won't have</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-orange-700 border-b border-orange-200 pb-1">
                      Process Improvement
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">PDCA</p>
                        <p className="text-xs text-gray-600">Plan, Do, Check, Act</p>
                      </div>
                      <div>
                        <p className="font-medium">LEAN</p>
                        <p className="text-xs text-gray-600">Value, Value Stream, Flow, Pull, Perfection</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-700 border-b border-red-200 pb-1">Communication</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">AIDA</p>
                        <p className="text-xs text-gray-600">Attention, Interest, Desire, Action</p>
                      </div>
                      <div>
                        <p className="font-medium">RACI</p>
                        <p className="text-xs text-gray-600">Responsible, Accountable, Consulted, Informed</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-indigo-700 border-b border-indigo-200 pb-1">Key Questions</h3>
                    <div className="space-y-1 text-xs">
                      <p>• What problem am I solving?</p>
                      <p>• Who is my target user?</p>
                      <p>• How will I measure success?</p>
                      <p>• What are the constraints?</p>
                      <p>• How can I test this?</p>
                      <p>• What could go wrong?</p>
                      <p>• How can I improve it?</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">Design Process Checklist:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Research Phase:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use ACCESSFM to analyze existing products</li>
                        <li>Apply PIES to understand external factors</li>
                        <li>Set SMART goals for your project</li>
                        <li>Identify user needs and requirements</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Design Phase:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Use SCAMPER for idea generation</li>
                        <li>Apply MOSCOW to prioritize features</li>
                        <li>Create and test prototypes</li>
                        <li>Gather user feedback continuously</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print-only content */}
        <div className="hidden print:block space-y-8 mt-8">
          <div className="page-break-before">
            <h2 className="text-xl font-bold mb-4">ACCESSFM Quick Reference</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>A - Aesthetics:</strong> How does it look, feel, sound?
                </p>
                <p>
                  <strong>C - Cost:</strong> Purchase, manufacturing, maintenance costs
                </p>
                <p>
                  <strong>C - Customer:</strong> Target market and user needs
                </p>
                <p>
                  <strong>E - Environment:</strong> Environmental impact and sustainability
                </p>
              </div>
              <div>
                <p>
                  <strong>S - Safety:</strong> Safety in use, manufacture, disposal
                </p>
                <p>
                  <strong>S - Size:</strong> Dimensions, weight, scale considerations
                </p>
                <p>
                  <strong>F - Function:</strong> What it does and how well it works
                </p>
                <p>
                  <strong>M - Materials:</strong> Material choices and properties
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">SCAMPER Quick Reference</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>S - Substitute:</strong> What can be substituted?
                </p>
                <p>
                  <strong>C - Combine:</strong> What can be combined together?
                </p>
                <p>
                  <strong>A - Adapt:</strong> What can be adapted from elsewhere?
                </p>
                <p>
                  <strong>M - Modify:</strong> What can be emphasized or enlarged?
                </p>
              </div>
              <div>
                <p>
                  <strong>P - Put to other use:</strong> How else can this be used?
                </p>
                <p>
                  <strong>E - Eliminate:</strong> What can be removed or simplified?
                </p>
                <p>
                  <strong>R - Reverse:</strong> What can be reversed or rearranged?
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Evaluation Questions</h2>
            <div className="text-sm space-y-2">
              <p>
                <strong>Functionality:</strong> Does it work as intended? How reliable is it?
              </p>
              <p>
                <strong>User Experience:</strong> Is it easy to use? What do users think?
              </p>
              <p>
                <strong>Quality:</strong> How well is it made? Is the finish professional?
              </p>
              <p>
                <strong>Safety:</strong> Is it safe to use? Does it meet standards?
              </p>
              <p>
                <strong>Cost:</strong> Is it good value? How does it compare to alternatives?
              </p>
              <p>
                <strong>Environment:</strong> What is the environmental impact?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
