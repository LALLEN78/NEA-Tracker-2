"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export default function NeaCriteriaPage() {
  const [activeSection, setActiveSection] = useState("section-a")

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">NEA Assessment Criteria</h1>
          <p className="text-muted-foreground">AQA GCSE Design and Technology assessment criteria for NEA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Criteria
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Criteria Overview</CardTitle>
          <CardDescription>
            The NEA is worth 50% of the GCSE and is marked out of 100. The criteria are divided into six sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section A</CardTitle>
                <CardDescription>Identifying & Investigating Design Possibilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10 marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section B</CardTitle>
                <CardDescription>Producing a Design Brief & Specification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10 marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section C</CardTitle>
                <CardDescription>Generating Design Ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20 marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section D</CardTitle>
                <CardDescription>Developing Design Ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20 marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section E</CardTitle>
                <CardDescription>Realising Design Ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20 marks</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section F</CardTitle>
                <CardDescription>Analysing & Evaluating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20 marks</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="section-a" value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="mb-4">
              <TabsTrigger value="section-a">Section A</TabsTrigger>
              <TabsTrigger value="section-b">Section B</TabsTrigger>
              <TabsTrigger value="section-c">Section C</TabsTrigger>
              <TabsTrigger value="section-d">Section D</TabsTrigger>
              <TabsTrigger value="section-e">Section E</TabsTrigger>
              <TabsTrigger value="section-f">Section F</TabsTrigger>
            </TabsList>

            <TabsContent value="section-a">
              <h3 className="text-lg font-bold mb-4">
                Section A: Identifying & Investigating Design Possibilities (10 marks)
              </h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">9-10</TableCell>
                      <TableCell>
                        <p>
                          Design possibilities identified and thoroughly explored, directly linked to a contextual
                          challenge demonstrating excellent understanding of the problems/opportunities.
                        </p>
                        <p>
                          A user/client has been clearly identified and is entirely relevant in all aspects to the
                          contextual challenge and student has undertaken a comprehensive investigation of their needs
                          and wants, with a clear explanation and justification of all aspects of these.
                        </p>
                        <p>Comprehensive investigation into the work of others that clearly informs ideas.</p>
                        <p>
                          Excellent design focus and full understanding of the impact on society including; economic and
                          social effects.
                        </p>
                        <p>
                          Extensive evidence that investigation of design possibilities has taken place throughout the
                          project with excellent justification and understanding of possibilities identified.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-8</TableCell>
                      <TableCell>
                        <p>
                          Design possibilities identified and explored, linked to a contextual challenge demonstrating a
                          good understanding of the problems/opportunities.
                        </p>
                        <p>
                          A user/client has been identified that is mostly relevant to the contextual challenge and
                          student has undertaken an investigation of their needs and wants, with a good explanation and
                          justification of most aspects of these.
                        </p>
                        <p>Detailed investigation into the work of others that has influenced ideas.</p>
                        <p>
                          Good design focus and understanding of the impact on society including; economic and social
                          effects.
                        </p>
                        <p>
                          Evidence of investigation of design possibilities at various stages in the project with good
                          justification and understanding of possibilities identified.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3-5</TableCell>
                      <TableCell>
                        <p>
                          Design possibilities identified and explored with some link to a contextual challenge
                          demonstrating adequate understanding of the problems/opportunities.
                        </p>
                        <p>
                          A user/client has been identified that is partially relevant to the contextual challenge.
                          Student has undertaken an investigation of their needs and wants, with some explanation and
                          justification of some aspects of these.
                        </p>
                        <p>Some investigation into the work of others that has had some influence on their ideas.</p>
                        <p>
                          Some design focus and understanding of the impact on society including; economic and social
                          effects.
                        </p>
                        <p>
                          Investigation of design possibilities goes beyond the initial stages of the project but only
                          some justification and understanding of possibilities identified.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-2</TableCell>
                      <TableCell>
                        <p>
                          Basic design possibilities identified with limited links to a contextual challenge
                          demonstrating limited understanding of the problems/opportunities.
                        </p>
                        <p>
                          A user/client has been identified but is of limited relevance to the contextual challenge.
                          Student has undertaken a basic investigation of their needs and wants, with limited
                          explanation and justification of some aspects of these.
                        </p>
                        <p>
                          Basic investigation into the work of others that has had limited influence on their ideas.
                        </p>
                        <p>
                          Limited design focus and understanding of the impact on society including; economic and social
                          effects.
                        </p>
                        <p>
                          Investigation of design possibilities only in the initial stages of the project with limited
                          justification and understanding of possibilities identified.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>Nothing worthy of credit.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="section-b">
              <h3 className="text-lg font-bold mb-4">Section B: Producing a Design Brief & Specification (10 marks)</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">9-10</TableCell>
                      <TableCell>
                        <p>
                          Comprehensive design brief that clearly justifies how they have considered their client/user's
                          needs and wants and links directly to the context selected.
                        </p>
                        <p>
                          Comprehensive design specification with very high level of justification linking to the needs
                          and wants of the client/user. Fully informs subsequent design stages.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-8</TableCell>
                      <TableCell>
                        <p>
                          Good design brief with some justification linking to how they have considered their
                          client/user's needs and wants and has clear links to the context selected.
                        </p>
                        <p>
                          Good design specification with good justification linking to the needs and wants of the
                          client/user. Largely informs subsequent design stages.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3-5</TableCell>
                      <TableCell>
                        <p>
                          Adequate design brief with some consideration of their client/user's needs and wants and has
                          some links to the context selected.
                        </p>
                        <p>
                          Adequate design specification with some justification linking to the needs and wants of the
                          client/user. Somewhat informs subsequent design stages.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-2</TableCell>
                      <TableCell>
                        <p>
                          Basic design brief that contains limited consideration of their client/user's needs and wants
                          and has limited links to the context selected.
                        </p>
                        <p>
                          Basic design specification has limited detail. Limited justification linking to the needs and
                          wants of the client/user. Limited influence on subsequent design stages.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>
                        <p>
                          Basic design brief that contains no consideration of their client's needs and wants and has no
                          relevance to the context selected.
                        </p>
                        <p>
                          Basic design specification has no detail. No justification linking to the needs and wants of
                          the client/user. No influence on subsequent design stages.
                        </p>
                        <p>Nothing worthy of credit.</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="section-c">
              <h3 className="text-lg font-bold mb-4">Section C: Generating Design Ideas (20 marks)</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">16-20</TableCell>
                      <TableCell>
                        <p>
                          Imaginative, creative and innovative ideas have been developed, fully avoiding design fixation
                          and with full consideration of functionality, aesthetics and innovation.
                        </p>
                        <p>
                          Ideas have been developed, that take full account of on-going investigation that is both fully
                          relevant and focused.
                        </p>
                        <p>
                          Extensive experimentation and excellent communication is evident, using a wide range of
                          techniques.
                        </p>
                        <p>
                          Imaginative use of different design strategies for different purposes and as part of a fully
                          integrated approach to designing.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">11-15</TableCell>
                      <TableCell>
                        <p>
                          Imaginative and creative ideas have been developed which mainly avoid design fixation and have
                          adequate consideration of functionality, aesthetics and innovation.
                        </p>
                        <p>
                          Ideas have been developed, taking into account on-going investigation that is relevant and
                          focused.
                        </p>
                        <p>Good experimentation and communication is evident, using a wide range of techniques.</p>
                        <p>
                          Effective use of different design strategies for different purposes as an approach to
                          designing.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-10</TableCell>
                      <TableCell>
                        <p>
                          Imaginative ideas have been developed with a degree of design fixation and having some
                          consideration of functionality, aesthetics and innovation.
                        </p>
                        <p>
                          Ideas have been developed that take some account of investigations carried out but may lack
                          relevance and/or focus.
                        </p>
                        <p>
                          Experimentation is sufficient to generate a range of ideas. Communication is evident, using a
                          range of techniques.
                        </p>
                        <p>
                          Different design strategies explored but only at a superficial level with the approach tending
                          to be fairly narrow.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-5</TableCell>
                      <TableCell>
                        <p>
                          Basic ideas have been generated with clear design fixation and limited consideration of
                          functionality, aesthetics and innovation.
                        </p>
                        <p>Ideas generated taking little or no account of investigations carried out.</p>
                        <p>Basic experimentation and communication is evident, using a limited number of techniques.</p>
                        <p>Basic use of a single design strategy.</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>Nothing worthy of credit.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="section-d">
              <h3 className="text-lg font-bold mb-4">Section D: Developing Design Ideas (20 marks)</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">16-20</TableCell>
                      <TableCell>
                        <p>
                          Very detailed development work is evident, using a wide range of 2D/3D techniques (including
                          CAD where appropriate) in order to develop a prototype.
                        </p>
                        <p>
                          Excellent modelling, using a wide variety of methods to test their design ideas, fully meeting
                          all requirements.
                        </p>
                        <p>
                          Fully appropriate materials/components selected with extensive research into their working
                          properties and availability.
                        </p>
                        <p>
                          Fully detailed manufacturing specification is produced with comprehensive justification to
                          inform manufacture.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">11-15</TableCell>
                      <TableCell>
                        <p>
                          Good development work is evident, using a range of 2D/3D techniques (including CAD where
                          appropriate) in order to develop a prototype.
                        </p>
                        <p>
                          Good modelling which uses a variety of methods to test their design ideas, largely meeting
                          requirements.
                        </p>
                        <p>
                          Materials/components selected are mostly appropriate with good research into their working
                          properties and availability.
                        </p>
                        <p>
                          Largely detailed manufacturing specification is produced with good justification to inform
                          manufacture.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-10</TableCell>
                      <TableCell>
                        <p>
                          Development work is sufficient, using some 2D/3D techniques (including CAD where appropriate)
                          in order to develop a prototype.
                        </p>
                        <p>
                          Modelling is sufficient, using a variety of methods to test their design ideas, meeting some
                          requirements.
                        </p>
                        <p>
                          Materials/components selected with some research into their working properties and
                          availability. Some of these may not be fully appropriate for purpose.
                        </p>
                        <p>
                          Adequate manufacturing specification contains sufficient detail with some justification to
                          inform manufacture.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-5</TableCell>
                      <TableCell>
                        <p>
                          Basic development work is evident, using a limited range of 2D/3D techniques (including CAD
                          where appropriate) in order to develop a prototype.
                        </p>
                        <p>
                          Modelling is basic, using a limited number of methods to test their design ideas meeting
                          requirements only superficially.
                        </p>
                        <p>
                          Materials/components selected with minimal research into their working properties or
                          availability and may not be fully fit for purpose.
                        </p>
                        <p>
                          Basic manufacturing specification that lacks detail and has minimal justification to inform
                          manufacture.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>Nothing worthy of credit.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="section-e">
              <h3 className="text-lg font-bold mb-4">Section E: Realising Design Ideas (20 marks)</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">16-20</TableCell>
                      <TableCell>
                        <p>
                          The correct tools, materials and equipment (including CAM where appropriate) have been
                          consistently used or operated safely with an exceptionally high level of skill.
                        </p>
                        <p>
                          A high level of quality control is evident to ensure the prototype is accurate by consistently
                          applying very close tolerances.
                        </p>
                        <p>
                          Prototype shows an exceptionally high level of making/finishing skills that are fully
                          consistent and appropriate to the desired outcome.
                        </p>
                        <p>
                          An exceptionally high quality prototype that has the potential to be commercially viable has
                          been produced and fully meets the needs of the client/user.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">11-15</TableCell>
                      <TableCell>
                        <p>
                          The correct tools, materials and equipment (including CAM where appropriate) have been used or
                          operated safely with a good level, of skill.
                        </p>
                        <p>
                          Detailed quality control is evident to ensure the prototype is mostly accurate through partial
                          application of tolerances.
                        </p>
                        <p>
                          Prototype shows a good level of making/finishing skills that are largely consistent and
                          appropriate to the desired outcome.
                        </p>
                        <p>
                          A good quality prototype that may have potential to be commercially viable has been produced
                          which mostly meets the needs of the client/user.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-10</TableCell>
                      <TableCell>
                        <p>
                          The correct tools, materials and equipment (including CAM where appropriate) have been used or
                          operated safely with an adequate level of skill.
                        </p>
                        <p>Some quality control is evident through measurement and testing.</p>
                        <p>
                          Prototype shows an adequate level of making/finishing skills that are mostly appropriate to
                          the desired outcome.
                        </p>
                        <p>
                          A prototype of sufficient quality has been produced that may have potential to be commercially
                          viable, although further developments would be required, and only partially meets the needs of
                          the client/user.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-5</TableCell>
                      <TableCell>
                        <p>
                          Tools, materials and equipment (including CAM where appropriate) have been used or operated
                          safely at a basic level.
                        </p>
                        <p>Basic quality control is evident through measurement only.</p>
                        <p>
                          Prototype shows a basic level of making/finishing skills which may not be appropriate for the
                          desired outcome.
                        </p>
                        <p>
                          A prototype of basic quality has been produced with little or no potential to be commercially
                          viable and does not meet the needs of the client/user.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>Nothing worthy of credit.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="section-f">
              <h3 className="text-lg font-bold mb-4">Section F: Analysing and Evaluating (20 marks)</h3>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Mark band</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">16-20</TableCell>
                      <TableCell>
                        <p>
                          Extensive evidence that various iterations are as a direct result of considerations linked to
                          testing, analysis and evaluation of the prototype, including well considered feedback from
                          third parties.
                        </p>
                        <p>
                          Comprehensive testing of all aspects of the final prototype against the design brief and
                          specification. Fully detailed and justified reference is made to any modifications both
                          proposed and undertaken.
                        </p>
                        <p>
                          Excellent ongoing analysis and evaluation evident throughout the project that clearly
                          influences the design brief and the design and manufacturing specifications.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">11-15</TableCell>
                      <TableCell>
                        <p>
                          Good evidence that various iterations are as a result of considerations linked to testing,
                          analysis and evaluation of the prototype, including some consideration of feedback from third
                          parties.
                        </p>
                        <p>
                          Good testing of most aspects of the final prototype against the design brief and
                          specification. Detailed reference is made to any modifications either proposed or undertaken.
                        </p>
                        <p>
                          Good analysis and evaluation at most stages of the project that influences the design brief
                          and the design and manufacturing specifications.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">6-10</TableCell>
                      <TableCell>
                        <p>
                          Some evidence that various iterations are as a result of considerations linked to testing,
                          analysis and evaluation of the prototype, including basic consideration of feedback from third
                          parties.
                        </p>
                        <p>
                          Adequate testing of some aspects of the final prototype against the design brief and
                          specification. Some reference is made to modifications either proposed or undertaken.
                        </p>
                        <p>
                          Adequate analysis and evaluation is present at some stages of the project but does not have
                          sufficient influence on the design brief and the design and manufacturing specifications.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">1-5</TableCell>
                      <TableCell>
                        <p>
                          Limited evidence that various iterations are as a result of considerations linked to testing,
                          analysis and evaluation of the prototype.
                        </p>
                        <p>
                          Basic testing of some aspects of the final prototype against the design brief and
                          specification. Little reference is made to any modifications either proposed or undertaken.
                        </p>
                        <p>
                          Superficial analysis and evaluation. Little influence on the design brief and the design and
                          manufacturing specifications.
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">0</TableCell>
                      <TableCell>Nothing worthy of credit.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
